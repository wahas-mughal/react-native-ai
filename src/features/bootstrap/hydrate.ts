import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeDatabase } from '../../db/bootstrap';

export const hydrateApp = createAsyncThunk('app/hydrate', () =>
  initializeDatabase(),
);
