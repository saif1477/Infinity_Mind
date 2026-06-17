import { DBClient } from '../../database/client';
import { EmbeddingEngine } from '../embeddings';

export interface SearchResult {
  chunk_id: number;
  content: string;
  distance: number;
}

export class RAGRetrieval {
  public static async search(query: string, materialId?: number, topK: number = 5): Promise<SearchResult[]> {
    const db = DBClient.getInstance();
    const queryEmbedding = await EmbeddingEngine.getEmbedding(query);
    const vectorString = JSON.stringify(queryEmbedding);

    let sql = `
      SELECT 
        c.id as chunk_id,
        c.content,
        vec_distance_L2(v.embedding, ?) as distance
      FROM chunk_embeddings v
      JOIN document_chunks c ON v.chunk_id = c.id
    `;

    const params: any[] = [vectorString];

    if (materialId) {
      sql += ` WHERE c.material_id = ? `;
      params.push(materialId);
    }

    sql += ` ORDER BY distance ASC LIMIT ?`;
    params.push(topK);

    const stmt = db.prepare(sql);
    const results = stmt.all(...params) as SearchResult[];

    return results;
  }
}
