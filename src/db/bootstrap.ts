import { EXERCISE_CATALOG } from '../data/exercises';
import type { Exercise } from '../types/exercise';
import type { Session } from '../types/session';
import { listExercises, seedExercises } from './exerciseRepo';
import { migrate } from './schema';
import { listSessions } from './sessionRepo';

export type HydrateResult = {
  exercises: Exercise[];
  sessions: Session[];
};

export async function initializeDatabase(): Promise<HydrateResult> {
  try {
    await migrate();
    await seedExercises();
    const [dbExercises, sessions] = await Promise.all([
      listExercises(),
      listSessions(),
    ]);
    const exercises = EXERCISE_CATALOG.map(
      catalogItem =>
        dbExercises.find(item => item.slug === catalogItem.slug) ?? catalogItem,
    );
    return {
      exercises,
      sessions,
    };
  } catch {
    return { exercises: EXERCISE_CATALOG, sessions: [] };
  }
}
