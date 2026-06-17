import { DBClient } from '../../database/client';

export interface QuizAttempt {
  topic: string;
  correct: boolean;
}

interface TopicStats {
  correct: number;
  total: number;
}

export class WeakTopicDetector {
  /**
   * Smoothing factor for exponential moving average.
   * Higher = more weight on new data, lower = more weight on history.
   */
  private static readonly EMA_ALPHA = 0.3;

  /**
   * Analyze quiz results and update topic mastery scores in the database.
   * Uses exponential moving average to blend new quiz performance with
   * existing mastery scores.
   *
   * @param profileId - The user profile ID
   * @param materialId - The study material ID
   * @param results - Array of quiz attempt results with topic and correctness
   */
  static async detectFromQuizResults(
    profileId: number,
    materialId: number,
    results: QuizAttempt[]
  ): Promise<void> {
    if (!results || results.length === 0) return;

    const db = DBClient.getInstance();

    // Aggregate results by topic
    const topicStats = new Map<string, TopicStats>();
    for (const result of results) {
      const topic = result.topic.trim();
      if (!topic) continue;

      const existing = topicStats.get(topic) || { correct: 0, total: 0 };
      existing.total += 1;
      if (result.correct) existing.correct += 1;
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
        const existing = getExistingStmt.get(profileId, topic) as {
          mastery_score: number;
          attempts: number;
          accuracy: number;
        } | undefined;

        if (existing) {
          // Exponential moving average: blends old score with new performance
          const blendedScore = (1 - this.EMA_ALPHA) * existing.mastery_score + this.EMA_ALPHA * newScore;
          const totalAttempts = existing.attempts + stats.total;
          // Weighted running accuracy
          const blendedAccuracy = totalAttempts > 0
            ? (existing.accuracy * existing.attempts + newAccuracy * stats.total) / totalAttempts
            : newAccuracy;

          upsertStmt.run(
            profileId, topic, blendedScore, stats.total, newAccuracy,
            blendedScore, blendedAccuracy
          );
        } else {
          // First time seeing this topic
          upsertStmt.run(
            profileId, topic, newScore, stats.total, newAccuracy,
            newScore, newAccuracy
          );
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
  private static updateMaterialWeakTopics(profileId: number, materialId: number): void {
    const db = DBClient.getInstance();

    const weakTopics = db.prepare(`
      SELECT topic_name, mastery_score
      FROM topic_mastery
      WHERE profile_id = ? AND mastery_score < 60
      ORDER BY mastery_score ASC
    `).all(profileId) as { topic_name: string; mastery_score: number }[];

    const weakTopicNames = weakTopics.map(t => t.topic_name);

    db.prepare(`
      UPDATE study_materials
      SET weak_topics = ?
      WHERE id = ? AND profile_id = ?
    `).run(JSON.stringify(weakTopicNames), materialId, profileId);
  }
}
