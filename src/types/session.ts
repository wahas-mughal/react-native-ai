import type { ExerciseSlug } from './exercise';

export type Session = {
  id: string;
  exerciseSlug: ExerciseSlug;
  startedAt: number;
  endedAt: number;
  repetitions: number;
  durationMs: number;
  accuracy: number | null;
  balance: number | null;
  speed: number | null;
  createdAt: number;
};

export type SessionPayload = {
  exercise: ExerciseSlug;
  repetitions: number;
  durationMs: number;
  accuracy: number | null;
  balance: number | null;
  speed: number | null;
};

export type NewSessionInput = {
  exerciseSlug: ExerciseSlug;
  startedAt: number;
  endedAt: number;
  repetitions: number;
};
