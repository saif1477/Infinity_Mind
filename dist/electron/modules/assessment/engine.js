"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentEngine = void 0;
const client_1 = require("../../database/client");
class AssessmentEngine {
    static calculatePercentile(rawScore, type) {
        // Real implementation would normalize based on aggregate population statistics
        return Math.min(100, Math.max(0, rawScore));
    }
    static async saveResult(profileId, type, rawScore) {
        const db = client_1.DBClient.getInstance();
        const percentile = this.calculatePercentile(rawScore, type);
        // Save to analytics
        db.prepare('INSERT INTO analytics (profile_id, metric_type, metric_value, metric_date) VALUES (?, ?, ?, datetime("now"))')
            .run(profileId, `assessment_${type.toLowerCase()}`, percentile);
    }
}
exports.AssessmentEngine = AssessmentEngine;
