import type { RootState } from '../../app/store';
import type { Exercise } from '../../types/exercise';
import type { Session } from '../../types/session';

export type ExerciseProgress = Exercise & {
  sessionCount: number;
  repetitions: number;
};

export type ProgressSummary = {
  totalSessions: number;
  totalReps: number;
  lastSessionAt: number | null;
  byExercise: ExerciseProgress[];
  maxReps: number;
};

export function summarizeProgress(
  sessions: Session[],
  exercises: Exercise[],
): ProgressSummary {
  const byExercise = exercises.map(exercise => {
    const matching = sessions.filter(
      session => session.exerciseSlug === exercise.slug,
    );
    return {
      ...exercise,
      sessionCount: matching.length,
      repetitions: matching.reduce((sum, session) => sum + session.repetitions, 0),
    };
  });

  return {
    totalSessions: sessions.length,
    totalReps: sessions.reduce((sum, session) => sum + session.repetitions, 0),
    lastSessionAt: sessions[0]?.createdAt ?? null,
    byExercise,
    maxReps: Math.max(1, ...byExercise.map(item => item.repetitions)),
  };
}

export function selectProgress(state: RootState): ProgressSummary {
  return summarizeProgress(state.history.sessions, state.exercises.items);
}
