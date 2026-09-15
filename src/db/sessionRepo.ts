import type { NewSessionInput, Session } from '../types/session';
import { createId } from '../utils/id';
import { getDb } from './client';
import { buildSession, mapSessionRow } from './sessionMapper';

export async function insertSession(input: NewSessionInput): Promise<Session> {
  const session = buildSession(input, createId('ses'), Date.now());
  await getDb().execute(
    `
      INSERT INTO sessions (
        id, exerciseSlug, startedAt, endedAt, repetitions, durationMs,
        accuracy, balance, speed, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      session.id,
      session.exerciseSlug,
      session.startedAt,
      session.endedAt,
      session.repetitions,
      session.durationMs,
      session.accuracy,
      session.balance,
      session.speed,
      session.createdAt,
    ],
  );
  return session;
}

export async function listSessions(): Promise<Session[]> {
  const result = await getDb().execute(
    'SELECT * FROM sessions ORDER BY createdAt DESC',
  );
  return result.rows.map(row => mapSessionRow(row));
}

export async function getSession(id: string): Promise<Session | null> {
  const result = await getDb().execute(
    'SELECT * FROM sessions WHERE id = ? LIMIT 1',
    [id],
  );
  const row = result.rows[0];
  return row ? mapSessionRow(row) : null;
}
