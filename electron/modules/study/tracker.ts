import { DBClient } from '../../database/client';

export interface StudySession {
  id?: number;
  profileId: number;
  subject: string;
  durationMinutes: number;
  focusScore: number;
}

export class StudyTracker {
  public static startSession(profileId: number, subject: string) {
    // Initiate memory session context
    console.log(`Starting session for profile ${profileId} on ${subject}`);
  }

  public static endSession(session: StudySession) {
    const db = DBClient.getInstance();
    
    db.prepare('INSERT INTO analytics (profile_id, metric_type, metric_value, metadata, metric_date) VALUES (?, ?, ?, ?, datetime("now"))')
      .run(session.profileId, 'study_session', session.durationMinutes, JSON.stringify({ subject: session.subject, focusScore: session.focusScore }));
  }
}
