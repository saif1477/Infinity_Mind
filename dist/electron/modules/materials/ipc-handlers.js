"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMaterialHandlers = registerMaterialHandlers;
const electron_1 = require("electron");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const client_1 = require("../../database/client");
const embeddings_1 = require("../../ai/embeddings");
const engine_1 = require("../../ai/engine");
const processor_1 = require("./processor");
const chunker_1 = require("./chunker");
const summarizer_1 = require("./summarizer");
const quiz_generator_1 = require("./quiz-generator");
const flashcard_generator_1 = require("./flashcard-generator");
// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB per file
const MAX_LIBRARY_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB total library
const SUPPORTED_EXTENSIONS = new Set([
    '.pdf', '.docx', '.pptx', '.txt', '.md'
]);
// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMaterialsDir() {
    const dir = path.join(electron_1.app.getPath('userData'), 'materials');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}
function getActiveProfileId() {
    const db = client_1.DBClient.getInstance();
    const profile = db.prepare('SELECT id FROM profiles WHERE is_active = 1').get();
    if (!profile)
        throw new Error('No active profile. Please create or select a profile first.');
    return profile.id;
}
function getLibrarySize(profileId) {
    const db = client_1.DBClient.getInstance();
    const result = db.prepare('SELECT COALESCE(SUM(file_size_bytes), 0) AS total FROM study_materials WHERE profile_id = ?').get(profileId);
    return result.total;
}
function updateMaterialStatus(materialId, status, extra) {
    const db = client_1.DBClient.getInstance();
    const sets = ['processing_status = ?'];
    const values = [status];
    if (extra) {
        for (const [key, value] of Object.entries(extra)) {
            sets.push(`${key} = ?`);
            values.push(value);
        }
    }
    if (status === 'ready' || status === 'error') {
        sets.push("processed_at = datetime('now')");
    }
    values.push(materialId);
    db.prepare(`UPDATE study_materials SET ${sets.join(', ')} WHERE id = ?`).run(...values);
}
// ─── Processing Pipeline ──────────────────────────────────────────────────────
async function runProcessingPipeline(materialId, filePath, fileType) {
    const db = client_1.DBClient.getInstance();
    try {
        // Step 1: Update status to processing
        updateMaterialStatus(materialId, 'processing');
        // Step 2: Extract text
        console.log(`[Materials] Extracting text from material ${materialId}...`);
        const { text, pageCount } = await processor_1.DocumentProcessor.extractText(filePath, fileType);
        if (pageCount) {
            db.prepare('UPDATE study_materials SET page_count = ? WHERE id = ?').run(pageCount, materialId);
        }
        // Step 3: Chunk text
        console.log(`[Materials] Chunking text for material ${materialId}...`);
        const chunks = chunker_1.TextChunker.chunk(text);
        if (chunks.length === 0) {
            throw new Error('No text chunks could be created from the document.');
        }
        // Step 4: Store chunks and generate embeddings
        console.log(`[Materials] Storing ${chunks.length} chunks and generating embeddings...`);
        const insertChunk = db.prepare(`
      INSERT INTO document_chunks (material_id, chunk_index, content, token_count)
      VALUES (?, ?, ?, ?)
    `);
        const insertEmbedding = db.prepare(`
      INSERT INTO chunk_embeddings (chunk_id, embedding)
      VALUES (?, ?)
    `);
        for (const chunk of chunks) {
            // Insert the chunk
            const chunkResult = insertChunk.run(materialId, chunk.index, chunk.content, chunk.tokenCount);
            const chunkId = chunkResult.lastInsertRowid;
            // Generate and store embedding
            try {
                const embedding = await embeddings_1.EmbeddingEngine.getEmbedding(chunk.content);
                const embeddingBuffer = Buffer.from(new Float32Array(embedding).buffer);
                insertEmbedding.run(chunkId, embeddingBuffer);
            }
            catch (err) {
                console.warn(`[Materials] Failed to embed chunk ${chunk.index}: ${err.message}`);
                // Continue with other chunks — partial embeddings are better than none
            }
        }
        // Step 5: Extract key topics using AI
        console.log(`[Materials] Extracting key topics for material ${materialId}...`);
        let keyTopics = null;
        try {
            // Use a representative subset of chunks for topic extraction
            const sampleText = chunks.slice(0, 5).map(c => c.content).join('\n\n');
            const topicsResponse = await engine_1.AIEngine.generateResponse('You are an expert content analyst. Extract the key topics from the following text. Return a JSON array of topic strings. ONLY output valid JSON.', `Extract the main topics from this text:\n\n${sampleText}`);
            // Validate it's parseable JSON
            const topicsJson = extractJSONArray(topicsResponse);
            JSON.parse(topicsJson); // validate
            keyTopics = topicsJson;
        }
        catch (err) {
            console.warn(`[Materials] Key topic extraction failed: ${err.message}`);
            // Non-fatal — continue without topics
        }
        // Step 6: Generate summary
        console.log(`[Materials] Generating summary for material ${materialId}...`);
        let summary = null;
        try {
            summary = await summarizer_1.Summarizer.summarize(text);
        }
        catch (err) {
            console.warn(`[Materials] Summary generation failed: ${err.message}`);
            // Non-fatal
        }
        // Step 7: Update record as ready
        updateMaterialStatus(materialId, 'ready', {
            chunk_count: chunks.length,
            summary: summary,
            key_topics: keyTopics,
        });
        console.log(`[Materials] Processing complete for material ${materialId}.`);
    }
    catch (err) {
        console.error(`[Materials] Processing failed for material ${materialId}:`, err);
        updateMaterialStatus(materialId, 'error', {
            processing_error: err.message || 'Unknown processing error',
        });
    }
}
/**
 * Extract a JSON array from text that might have markdown fences or extra content.
 */
function extractJSONArray(text) {
    const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (fenceMatch)
        return fenceMatch[1].trim();
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch)
        return arrayMatch[0];
    return text.trim();
}
// ─── IPC Handlers ─────────────────────────────────────────────────────────────
function registerMaterialHandlers(ipcMain) {
    // ─── material:upload ──────────────────────────────────────────────────────
    ipcMain.handle('material:upload', async (_event, args) => {
        try {
            const { filePath, subject } = args;
            // Validate file exists
            if (!fs.existsSync(filePath)) {
                return { success: false, error: 'File not found.' };
            }
            // Validate extension
            const ext = path.extname(filePath).toLowerCase();
            if (!SUPPORTED_EXTENSIONS.has(ext)) {
                return {
                    success: false,
                    error: `Unsupported file type: ${ext}. Supported: ${[...SUPPORTED_EXTENSIONS].join(', ')}`,
                };
            }
            // Validate file size
            const stat = await fs.promises.stat(filePath);
            if (stat.size > MAX_FILE_SIZE) {
                return {
                    success: false,
                    error: `File exceeds 100MB limit (${(stat.size / 1024 / 1024).toFixed(1)}MB).`,
                };
            }
            const profileId = getActiveProfileId();
            // Validate library size
            const currentLibrarySize = getLibrarySize(profileId);
            if (currentLibrarySize + stat.size > MAX_LIBRARY_SIZE) {
                return {
                    success: false,
                    error: 'Library storage limit (2GB) would be exceeded. Delete some materials first.',
                };
            }
            // Copy file to app data directory
            const fileName = path.basename(filePath);
            const timestamp = Date.now();
            const storedName = `${timestamp}_${fileName}`;
            const destPath = path.join(getMaterialsDir(), storedName);
            await fs.promises.copyFile(filePath, destPath);
            // Create DB record
            const db = client_1.DBClient.getInstance();
            const result = db.prepare(`
        INSERT INTO study_materials (profile_id, title, file_name, file_type, file_path, file_size_bytes, subject, processing_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'processing')
      `).run(profileId, path.basename(fileName, ext), // title without extension
            fileName, ext.replace('.', ''), destPath, stat.size, subject || null);
            const materialId = result.lastInsertRowid;
            // Fire and forget: start async processing pipeline
            runProcessingPipeline(materialId, destPath, ext).catch(err => {
                console.error(`[Materials] Background pipeline error for ${materialId}:`, err);
            });
            return {
                success: true,
                materialId,
                message: 'Upload started. Processing in background.',
            };
        }
        catch (err) {
            console.error('[Materials] Upload error:', err);
            return { success: false, error: err.message || 'Upload failed.' };
        }
    });
    // ─── material:list ────────────────────────────────────────────────────────
    ipcMain.handle('material:list', async () => {
        try {
            const profileId = getActiveProfileId();
            const db = client_1.DBClient.getInstance();
            const materials = db.prepare(`
        SELECT id, title, file_name, file_type, file_size_bytes, subject,
               page_count, chunk_count, summary, key_topics, weak_topics,
               processing_status, processing_error, uploaded_at, processed_at
        FROM study_materials
        WHERE profile_id = ?
        ORDER BY uploaded_at DESC
      `).all(profileId);
            return { success: true, materials };
        }
        catch (err) {
            console.error('[Materials] List error:', err);
            return { success: false, error: err.message || 'Failed to list materials.' };
        }
    });
    // ─── material:get ─────────────────────────────────────────────────────────
    ipcMain.handle('material:get', async (_event, args) => {
        try {
            const profileId = getActiveProfileId();
            const db = client_1.DBClient.getInstance();
            const material = db.prepare(`
        SELECT id, title, file_name, file_type, file_size_bytes, subject,
               page_count, chunk_count, summary, key_topics, weak_topics,
               processing_status, processing_error, uploaded_at, processed_at
        FROM study_materials
        WHERE id = ? AND profile_id = ?
      `).get(args.materialId, profileId);
            if (!material) {
                return { success: false, error: 'Material not found.' };
            }
            const chunks = db.prepare(`
        SELECT id, chunk_index, content, page_number, section_title, token_count
        FROM document_chunks
        WHERE material_id = ?
        ORDER BY chunk_index ASC
      `).all(args.materialId);
            return { success: true, material, chunks };
        }
        catch (err) {
            console.error('[Materials] Get error:', err);
            return { success: false, error: err.message || 'Failed to get material.' };
        }
    });
    // ─── material:delete ──────────────────────────────────────────────────────
    ipcMain.handle('material:delete', async (_event, args) => {
        try {
            const profileId = getActiveProfileId();
            const db = client_1.DBClient.getInstance();
            // Get file path before deleting record
            const material = db.prepare('SELECT file_path FROM study_materials WHERE id = ? AND profile_id = ?').get(args.materialId, profileId);
            if (!material) {
                return { success: false, error: 'Material not found.' };
            }
            // Delete embeddings for this material's chunks
            db.prepare(`
        DELETE FROM chunk_embeddings
        WHERE chunk_id IN (
          SELECT id FROM document_chunks WHERE material_id = ?
        )
      `).run(args.materialId);
            // Delete chunks (will cascade from study_materials FK, but explicit is clearer)
            db.prepare('DELETE FROM document_chunks WHERE material_id = ?').run(args.materialId);
            // Delete the material record
            db.prepare('DELETE FROM study_materials WHERE id = ? AND profile_id = ?').run(args.materialId, profileId);
            // Delete the physical file
            if (fs.existsSync(material.file_path)) {
                await fs.promises.unlink(material.file_path);
            }
            return { success: true };
        }
        catch (err) {
            console.error('[Materials] Delete error:', err);
            return { success: false, error: err.message || 'Failed to delete material.' };
        }
    });
    // ─── material:summarize ───────────────────────────────────────────────────
    ipcMain.handle('material:summarize', async (_event, args) => {
        try {
            const profileId = getActiveProfileId();
            const db = client_1.DBClient.getInstance();
            // Get chunks for the material
            const chunks = db.prepare(`
        SELECT content FROM document_chunks
        WHERE material_id IN (
          SELECT id FROM study_materials WHERE id = ? AND profile_id = ?
        )
        ORDER BY chunk_index ASC
      `).all(args.materialId, profileId);
            if (chunks.length === 0) {
                return { success: false, error: 'No content found. Material may still be processing.' };
            }
            const fullText = chunks.map(c => c.content).join('\n\n');
            const summary = await summarizer_1.Summarizer.summarize(fullText);
            // Update the material record
            db.prepare('UPDATE study_materials SET summary = ? WHERE id = ?').run(summary, args.materialId);
            return { success: true, summary };
        }
        catch (err) {
            console.error('[Materials] Summarize error:', err);
            return { success: false, error: err.message || 'Summarization failed.' };
        }
    });
    // ─── material:generate-quiz ───────────────────────────────────────────────
    ipcMain.handle('material:generate-quiz', async (_event, args) => {
        try {
            const profileId = getActiveProfileId();
            const db = client_1.DBClient.getInstance();
            const chunks = db.prepare(`
        SELECT content FROM document_chunks
        WHERE material_id IN (
          SELECT id FROM study_materials WHERE id = ? AND profile_id = ?
        )
        ORDER BY chunk_index ASC
      `).all(args.materialId, profileId);
            if (chunks.length === 0) {
                return { success: false, error: 'No content found. Material may still be processing.' };
            }
            const fullText = chunks.map(c => c.content).join('\n\n');
            const questions = await quiz_generator_1.QuizGenerator.generate(fullText, args.count);
            return { success: true, questions };
        }
        catch (err) {
            console.error('[Materials] Quiz generation error:', err);
            return { success: false, error: err.message || 'Quiz generation failed.' };
        }
    });
    // ─── material:generate-flashcards ─────────────────────────────────────────
    ipcMain.handle('material:generate-flashcards', async (_event, args) => {
        try {
            const profileId = getActiveProfileId();
            const db = client_1.DBClient.getInstance();
            const chunks = db.prepare(`
        SELECT content FROM document_chunks
        WHERE material_id IN (
          SELECT id FROM study_materials WHERE id = ? AND profile_id = ?
        )
        ORDER BY chunk_index ASC
      `).all(args.materialId, profileId);
            if (chunks.length === 0) {
                return { success: false, error: 'No content found. Material may still be processing.' };
            }
            const fullText = chunks.map(c => c.content).join('\n\n');
            const flashcards = await flashcard_generator_1.FlashcardGenerator.generate(fullText, args.count);
            return { success: true, flashcards };
        }
        catch (err) {
            console.error('[Materials] Flashcard generation error:', err);
            return { success: false, error: err.message || 'Flashcard generation failed.' };
        }
    });
}
