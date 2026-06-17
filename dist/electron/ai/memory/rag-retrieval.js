"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGRetrieval = void 0;
const client_1 = require("../../database/client");
const embeddings_1 = require("../embeddings");
class RAGRetrieval {
    static async search(query, materialId, topK = 5) {
        const db = client_1.DBClient.getInstance();
        const queryEmbedding = await embeddings_1.EmbeddingEngine.getEmbedding(query);
        const vectorString = JSON.stringify(queryEmbedding);
        let sql = `
      SELECT 
        c.id as chunk_id,
        c.content,
        vec_distance_L2(v.embedding, ?) as distance
      FROM chunk_embeddings v
      JOIN document_chunks c ON v.chunk_id = c.id
    `;
        const params = [vectorString];
        if (materialId) {
            sql += ` WHERE c.material_id = ? `;
            params.push(materialId);
        }
        sql += ` ORDER BY distance ASC LIMIT ?`;
        params.push(topK);
        const stmt = db.prepare(sql);
        const results = stmt.all(...params);
        return results;
    }
}
exports.RAGRetrieval = RAGRetrieval;
