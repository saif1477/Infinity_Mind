import { DBClient } from './client';
import * as fs from 'fs';
import * as path from 'path';

export function runMigrations() {
  const db = DBClient.getInstance();
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      executed_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const migrationsDir = path.join(__dirname, 'migrations');
  if (!fs.existsSync(migrationsDir)) return;

  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  
  const executed = db.prepare('SELECT name FROM migrations').all() as {name: string}[];
  const executedSet = new Set(executed.map(m => m.name));

  for (const file of files) {
    if (!executedSet.has(file)) {
      console.log(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      
      const transaction = db.transaction(() => {
        db.exec(sql);
        db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
      });
      
      transaction();
    }
  }
}
