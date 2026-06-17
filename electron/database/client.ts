import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { app } from 'electron';
import * as path from 'path';

export class DBClient {
  private static instance: Database.Database;

  public static getInstance(): Database.Database {
    if (!DBClient.instance) {
      const dbPath = path.join(app.getPath('userData'), 'infinity_mind.db');
      DBClient.instance = new Database(dbPath);
      sqliteVec.load(DBClient.instance);
      DBClient.instance.pragma('journal_mode = WAL');
    }
    return DBClient.instance;
  }

  public static close(): void {
    if (DBClient.instance) {
      DBClient.instance.close();
      DBClient.instance = null as any;
    }
  }
}
