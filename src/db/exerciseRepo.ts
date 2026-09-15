import { EXERCISE_CATALOG } from '../data/exercises';
import type { Exercise } from '../types/exercise';
import { getDb } from './client';

function parseCues(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(String);
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapExerciseRow(row: Record<string, unknown>): Exercise {
  return {
    id: String(row.id),
    slug: row.slug as Exercise['slug'],
    name: String(row.name),
    cues: parseCues(row.cues),
    defaultTargetReps: Number(row.defaultTargetReps),
  };
}

export async function seedExercises(): Promise<void> {
  const db = getDb();
  for (const exercise of EXERCISE_CATALOG) {
    await db.execute(
      `
        INSERT INTO exercises (id, slug, name, cues, defaultTargetReps)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET
          name = excluded.name,
          cues = excluded.cues,
          defaultTargetReps = excluded.defaultTargetReps
      `,
      [
        exercise.id,
        exercise.slug,
        exercise.name,
        JSON.stringify(exercise.cues),
        exercise.defaultTargetReps,
      ],
    );
  }
}

export async function listExercises(): Promise<Exercise[]> {
  const result = await getDb().execute(
    'SELECT id, slug, name, cues, defaultTargetReps FROM exercises ORDER BY name ASC',
  );
  return result.rows.map(row => mapExerciseRow(row));
}
