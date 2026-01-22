import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  wallpaper: string; // URL or path
  volume: number;
  brightness: number;
}

const initialState: SettingsState = {
  theme: 'dark', // Default to dark mode like Win10/11 default
  wallpaper: '/assets/wallpapers/cyberpunk.svg',
  volume: 50,
  brightness: 100,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setWallpaper: (state, action: PayloadAction<string>) => {
      state.wallpaper = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setTheme, setWallpaper, setVolume, toggleTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
