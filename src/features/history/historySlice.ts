import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { insertSession } from '../../db/sessionRepo';
import type { NewSessionInput, Session } from '../../types/session';
import { hydrateApp } from '../bootstrap/hydrate';

type HistoryState = {
  sessions: Session[];
  saving: boolean;
  saveError: string | null;
};

const initialState: HistoryState = {
  sessions: [],
  saving: false,
  saveError: null,
};

export const saveCompletedSession = createAsyncThunk(
  'history/saveCompletedSession',
  async (input: NewSessionInput) => insertSession(input),
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    sessionAdded(state, action: PayloadAction<Session>) {
      state.sessions.unshift(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(hydrateApp.fulfilled, (state, action) => {
        state.sessions = action.payload.sessions;
      })
      .addCase(saveCompletedSession.pending, state => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveCompletedSession.fulfilled, (state, action) => {
        state.saving = false;
        state.sessions.unshift(action.payload);
      })
      .addCase(saveCompletedSession.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.error.message ?? 'Could not save session.';
      });
  },
});

export const { sessionAdded } = historySlice.actions;
export const historyReducer = historySlice.reducer;
