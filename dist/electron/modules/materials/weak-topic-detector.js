"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeakTopicDetector = void 0;
const client_1 = require("../../database/client");
class WeakTopicDetector {
    /**
     * Smoothing factor for exponential moving average.
     * Higher = more weight on new data, lower = more weight on history.
     */
    static EMA_ALPHA = 0.3;
    /**
     * Analyze quiz results and update topic mastery scores in the database.
     * Uses exponential moving average to blend new quiz performance with
     * existing mastery scores.
     *
     * @param profileId - The user profile ID
     * @param materialId - The study material ID
     * @param results - Array of quiz attempt results with topic and correctness
     */
    static async detectFromQuizResults(profileId, materialId, results) {
        if (!results || results.length === 0)
            return;
        const db = client_1.DBClient.getInstance();
        // Aggregate results by topic
        const topicStats = new Map();
        for (const result of results) {
            const topic = result.topic.trim();
            if (!topic)
                continue;
            const existing = topicStats.get(topic) || { correct: 0, total: 0 };
            existing.total += 1;
            if (result.correct)
                existing.correct += 1;
            topicStats.set(topic, existing);
        }
        // Upsert each topic into topic_mastery
        const upsertStmt = db.prepare(`
      INSERT INTO topic_mastery (profile_id, topic_name, mastery_score, last_seen, attempts, accuracy, updated_at)
      VALUES (?, ?, ?, datetime('now'), ?, ?, datetime('now'))
      ON CONFLICT(profile_id, topic_name) DO UPDATE SET
        mastery_score = ?,
        last_seen = datetime('now'),
        attempts = topic_mastery.attempts + excluded.attempts,
        accuracy = ?,
        updated_at = datetime('now')
    `);
        const getExistingStmt = db.prepare(`
      SELECT mastery_score, attempts, accuracy
      FROM topic_mastery
      WHERE profile_id = ? AND topic_name = ?
    `);
        const updateTransaction = db.transaction(() => {
            for (const [topic, stats] of topicStats) {
                const newAccuracy = stats.total > 0 ? stats.correct / stats.total : 0;
                const newScore = newAccuracy * 100; // Score from 0-100
                // Check for existing record to blend scores
                const existing = getExistingStmt.get(profileId, topic);
                if (existing) {
                    // Exponential moving average: blends old score with new performance
                    const blendedScore = (1 - this.EMA_ALPHA) * existing.mastery_score + this.EMA_ALPHA * newScore;
                    const totalAttempts = existing.attempts + stats.total;
                    // Weighted running accuracy
                    const blendedAccuracy = totalAttempts > 0
                        ? (existing.accuracy * existing.attempts + newAccuracy * stats.total) / totalAttempts
                        : newAccuracy;
                    upsertStmt.run(profileId, topic, blendedScore, stats.total, newAccuracy, blendedScore, blendedAccuracy);
                }
                else {
                    // First time seeing this topic
                    upsertStmt.run(profileId, topic, newScore, stats.total, newAccuracy, newScore, newAccuracy);
                }
            }
        });
        updateTransaction();
        // Update weak_topics on the material record
        this.updateMaterialWeakTopics(profileId, materialId);
    }
    /**
     * Identify weak topics (mastery < 60%) and store them on the material record.
     */
    static updateMaterialWeakTopics(profileId, materialId) {
        const db = client_1.DBClient.getInstance();
        const weakTopics = db.prepare(`
      SELECT topic_name, mastery_score
      FROM topic_mastery
      WHERE profile_id = ? AND mastery_score < 60
      ORDER BY mastery_score ASC
    `).all(profileId);
        const weakTopicNames = weakTopics.map(t => t.topic_name);
        db.prepare(`
      UPDATE study_materials
      SET weak_topics = ?
      WHERE id = ? AND profile_id = ?
    `).run(JSON.stringify(weakTopicNames), materialId, profileId);
    }
}
exports.WeakTopicDetector = WeakTopicDetector;
