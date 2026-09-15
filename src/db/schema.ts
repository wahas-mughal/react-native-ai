import { getDb } from './client';

const CREATE_EXERCISES = `
  CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    cues TEXT NOT NULL,
    defaultTargetReps INTEGER NOT NULL
  )
`;

const CREATE_SESSIONS = `
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    exerciseSlug TEXT NOT NULL,
    startedAt INTEGER NOT NULL,
    endedAt INTEGER NOT NULL,
    repetitions INTEGER NOT NULL,
    durationMs INTEGER NOT NULL,
    accuracy REAL,
    balance REAL,
    speed REAL,
    createdAt INTEGER NOT NULL
  )
`;

export async function migrate(): Promise<void> {
  const db = getDb();
  await db.execute(CREATE_EXERCISES);
  await db.execute(CREATE_SESSIONS);
  await db.execute(
    'CREATE INDEX IF NOT EXISTS idx_sessions_createdAt ON sessions(createdAt DESC)',
  );
}
