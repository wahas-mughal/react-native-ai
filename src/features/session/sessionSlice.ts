import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ExerciseSlug } from '../../types/exercise';

export type ActiveSessionStatus = 'idle' | 'running' | 'ended';

export type ActiveSessionState = {
  exerciseSlug: ExerciseSlug | null;
  startedAt: number | null;
  endedAt: number | null;
  repetitions: number;
  status: ActiveSessionStatus;
};

export const initialActiveSessionState: ActiveSessionState = {
  exerciseSlug: null,
  startedAt: null,
  endedAt: null,
  repetitions: 0,
  status: 'idle',
};

const sessionSlice = createSlice({
  name: 'activeSession',
  initialState: initialActiveSessionState,
  reducers: {
    startSession(
      state,
      action: PayloadAction<{ exerciseSlug: ExerciseSlug; startedAt: number }>,
    ) {
      state.exerciseSlug = action.payload.exerciseSlug;
      state.startedAt = action.payload.startedAt;
      state.endedAt = null;
      state.repetitions = 0;
      state.status = 'running';
    },
    incrementRep(state) {
      if (state.status === 'running') {
        state.repetitions += 1;
      }
    },
    endSession(state, action: PayloadAction<{ endedAt: number }>) {
      if (state.status !== 'running' || state.startedAt == null) {
        return;
      }
      state.endedAt = action.payload.endedAt;
      state.status = 'ended';
    },
    resetSession() {
      return initialActiveSessionState;
    },
  },
});

export const { startSession, incrementRep, endSession, resetSession } =
  sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;

export function selectSessionDurationMs(state: ActiveSessionState): number {
  if (state.startedAt == null) {
    return 0;
  }
  const end = state.endedAt ?? Date.now();
  return Math.max(0, end - state.startedAt);
}
