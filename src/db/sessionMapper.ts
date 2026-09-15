import type { NewSessionInput, Session, SessionPayload } from '../types/session';
import type { ExerciseSlug } from '../types/exercise';
import { EXERCISE_SLUGS } from '../types/exercise';

export function isExerciseSlug(value: string): value is ExerciseSlug {
  return (EXERCISE_SLUGS as readonly string[]).includes(value);
}

export function buildSession(
  input: NewSessionInput,
  id: string,
  createdAt: number,
): Session {
  return {
    id,
    exerciseSlug: input.exerciseSlug,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    repetitions: input.repetitions,
    durationMs: Math.max(0, input.endedAt - input.startedAt),
    accuracy: null,
    balance: null,
    speed: null,
    createdAt,
  };
}

export function toSessionPayload(session: Session): SessionPayload {
  return {
    exercise: session.exerciseSlug,
    repetitions: session.repetitions,
    durationMs: session.durationMs,
    accuracy: session.accuracy,
    balance: session.balance,
    speed: session.speed,
  };
}

export function mapSessionRow(row: Record<string, unknown>): Session {
  const slug = String(row.exerciseSlug ?? '');
  if (!isExerciseSlug(slug)) {
    throw new Error(`Unknown exercise slug: ${slug}`);
  }

  return {
    id: String(row.id),
    exerciseSlug: slug,
    startedAt: Number(row.startedAt),
    endedAt: Number(row.endedAt),
    repetitions: Number(row.repetitions),
    durationMs: Number(row.durationMs),
    accuracy: row.accuracy == null ? null : Number(row.accuracy),
    balance: row.balance == null ? null : Number(row.balance),
    speed: row.speed == null ? null : Number(row.speed),
    createdAt: Number(row.createdAt),
  };
}
