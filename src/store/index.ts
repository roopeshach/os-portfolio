import { configureStore } from '@reduxjs/toolkit';
import processReducer from './processSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    process: processReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
