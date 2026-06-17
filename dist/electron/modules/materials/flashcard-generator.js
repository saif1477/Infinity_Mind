"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardGenerator = void 0;
const engine_1 = require("../../ai/engine");
const prompts_1 = require("../../ai/prompts/prompts");
const chunker_1 = require("./chunker");
class FlashcardGenerator {
    static MAX_INPUT_TOKENS = 2500;
    static MAX_RETRIES = 2;
    /**
     * Generate flashcards from the provided text.
     * @param text - Source text to generate flashcards from
     * @param count - Number of flashcards to generate (default 10)
     */
    static async generate(text, count = 10) {
        if (!text || text.trim().length === 0) {
            throw new Error('Cannot generate flashcards from empty text.');
        }
        // If text is too long, take the most representative chunks
        let inputText = text;
        const estimatedTokens = chunker_1.TextChunker.estimateTokens(text);
        if (estimatedTokens > this.MAX_INPUT_TOKENS) {
            const chunks = chunker_1.TextChunker.chunk(text, this.MAX_INPUT_TOKENS, 0);
            inputText = chunks.slice(0, 2).map(c => c.content).join('\n\n');
        }
        const userPrompt = count !== 10
            ? `Generate exactly ${count} flashcards from this text:\n\n${inputText}`
            : `Generate flashcards from this text:\n\n${inputText}`;
        let lastError = null;
        for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                const response = await engine_1.AIEngine.generateResponse(prompts_1.SYSTEM_PROMPTS.FLASHCARD_GENERATOR, userPrompt);
                const flashcards = this.parseResponse(response);
                if (flashcards.length === 0) {
                    throw new Error('Parsed response contained no valid flashcards.');
                }
                return flashcards;
            }
            catch (err) {
                lastError = err;
                console.warn(`Flashcard generation attempt ${attempt + 1} failed: ${err.message}`);
            }
        }
        throw new Error(`Flashcard generation failed after ${this.MAX_RETRIES + 1} attempts: ${lastError?.message}`);
    }
    /**
     * Parse the AI response into structured Flashcard objects.
     */
    static parseResponse(response) {
        const jsonStr = this.extractJSON(response);
        let parsed;
        try {
            parsed = JSON.parse(jsonStr);
        }
        catch {
            // Try fixing common JSON issues
            const fixed = jsonStr
                .replace(/,\s*]/g, ']')
                .replace(/,\s*}/g, '}')
                .replace(/'/g, '"')
                .replace(/\n/g, '\\n');
            try {
                parsed = JSON.parse(fixed);
            }
            catch (err) {
                throw new Error(`Failed to parse flashcard JSON: ${err.message}`);
            }
        }
        if (!Array.isArray(parsed)) {
            throw new Error('Expected a JSON array of flashcards.');
        }
        return parsed
            .map((item, i) => this.normalizeFlashcard(item, i))
            .filter(Boolean);
    }
    /**
     * Normalize a single raw flashcard object.
     */
    static normalizeFlashcard(item, index) {
        try {
            const front = item.front || item.Front || item.concept || item.term || '';
            const back = item.back || item.Back || item.definition || item.answer || '';
            if (!front || !back) {
                console.warn(`Skipping malformed flashcard at index ${index}`);
                return null;
            }
            return {
                front: String(front).trim(),
                back: String(back).trim(),
            };
        }
        catch {
            console.warn(`Failed to normalize flashcard at index ${index}`);
            return null;
        }
    }
    /**
     * Extract JSON array from an AI response that might contain markdown fences.
     */
    static extractJSON(text) {
        const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
        if (fenceMatch) {
            return fenceMatch[1].trim();
        }
        const arrayMatch = text.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            return arrayMatch[0];
        }
        return text.trim();
    }
}
exports.FlashcardGenerator = FlashcardGenerator;
