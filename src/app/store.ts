import { configureStore } from '@reduxjs/toolkit';
import { exercisesReducer } from '../features/exercises/exercisesSlice';
import { historyReducer } from '../features/history/historySlice';
import { sessionReducer } from '../features/session/sessionSlice';

export const store = configureStore({
  reducer: {
    exercises: exercisesReducer,
    activeSession: sessionReducer,
    history: historyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
