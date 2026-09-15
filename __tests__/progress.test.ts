import { EXERCISE_CATALOG } from '../src/data/exercises';
import { summarizeProgress } from '../src/features/history/progress';
import { buildSession } from '../src/db/sessionMapper';

describe('summarizeProgress', () => {
  it('aggregates reps and sessions per exercise', () => {
    const sessions = [
      buildSession(
        {
          exerciseSlug: 'front_kick',
          startedAt: 0,
          endedAt: 1_000,
          repetitions: 10,
        },
        'a',
        1_000,
      ),
      buildSession(
        {
          exerciseSlug: 'front_kick',
          startedAt: 2_000,
          endedAt: 3_000,
          repetitions: 8,
        },
        'b',
        3_000,
      ),
      buildSession(
        {
          exerciseSlug: 'punch',
          startedAt: 4_000,
          endedAt: 5_000,
          repetitions: 20,
        },
        'c',
        5_000,
      ),
    ];

    const summary = summarizeProgress(sessions, EXERCISE_CATALOG);
    const frontKick = summary.byExercise.find(
      item => item.slug === 'front_kick',
    );
    const roundhouse = summary.byExercise.find(
      item => item.slug === 'roundhouse_kick',
    );

    expect(summary.totalSessions).toBe(3);
    expect(summary.totalReps).toBe(38);
    expect(frontKick?.repetitions).toBe(18);
    expect(frontKick?.sessionCount).toBe(2);
    expect(roundhouse?.repetitions).toBe(0);
  });
});
