import type { Exercise } from '../types/exercise';

export const EXERCISE_CATALOG: Exercise[] = [
  {
    id: 'ex_front_kick',
    slug: 'front_kick',
    name: 'Front Kick',
    defaultTargetReps: 10,
    cues: [
      'Chamber the knee before you extend.',
      'Keep the supporting foot planted and the heel down.',
      'Strike with the ball of the foot, hips square.',
    ],
  },
  {
    id: 'ex_roundhouse_kick',
    slug: 'roundhouse_kick',
    name: 'Roundhouse',
    defaultTargetReps: 10,
    cues: [
      'Pivot on the supporting foot as the hip turns over.',
      'Chamber the knee, then extend through the target.',
      'Keep the guard up through the whole kick.',
    ],
  },
  {
    id: 'ex_punch',
    slug: 'punch',
    name: 'Punch',
    defaultTargetReps: 20,
    cues: [
      'Keep the rear hand at the guard.',
      'Rotate the hip and shoulder together.',
      'Snap the punch back on the same path.',
    ],
  },
];

export function getExerciseBySlug(slug: string): Exercise | undefined {
  return EXERCISE_CATALOG.find(exercise => exercise.slug === slug);
}
