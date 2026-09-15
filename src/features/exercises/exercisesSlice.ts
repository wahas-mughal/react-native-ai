import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { EXERCISE_CATALOG } from '../../data/exercises';
import type { Exercise } from '../../types/exercise';
import { hydrateApp } from '../bootstrap/hydrate';

type ExercisesState = {
  items: Exercise[];
};

const initialState: ExercisesState = {
  items: EXERCISE_CATALOG,
};

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setExercises(state, action: PayloadAction<Exercise[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(hydrateApp.fulfilled, (state, action) => {
      state.items = action.payload.exercises;
    });
  },
});

export const { setExercises } = exercisesSlice.actions;
export const exercisesReducer = exercisesSlice.reducer;
