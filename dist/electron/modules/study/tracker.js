"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyTracker = void 0;
const client_1 = require("../../database/client");
class StudyTracker {
    static startSession(profileId, subject) {
        // Initiate memory session context
        console.log(`Starting session for profile ${profileId} on ${subject}`);
    }
    static endSession(session) {
        const db = client_1.DBClient.getInstance();
        db.prepare('INSERT INTO analytics (profile_id, metric_type, metric_value, metadata, metric_date) VALUES (?, ?, ?, ?, datetime("now"))')
            .run(session.profileId, 'study_session', session.durationMinutes, JSON.stringify({ subject: session.subject, focusScore: session.focusScore }));
    }
}
exports.StudyTracker = StudyTracker;
