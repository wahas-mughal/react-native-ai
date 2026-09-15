export const EXERCISE_SLUGS = [
  'front_kick',
  'roundhouse_kick',
  'punch',
] as const;

export type ExerciseSlug = (typeof EXERCISE_SLUGS)[number];

export type Exercise = {
  id: string;
  slug: ExerciseSlug;
  name: string;
  cues: string[];
  defaultTargetReps: number;
};
