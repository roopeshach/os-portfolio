import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  theme: 'light' | 'dark';
  wallpaper: string;
  volume: number;
  brightness: number;
  soundEnabled: boolean;
}

const initialState: SettingsState = {
  theme: 'dark', // Default to dark mode like Win10/11 default
  wallpaper: '/assets/wallpapers/cyberpunk.svg',
  volume: 50,
  brightness: 100,
  soundEnabled: true,
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
    setBrightness: (state, action: PayloadAction<number>) => {
      state.brightness = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
  },
});

export const { setTheme, setWallpaper, setVolume, setBrightness, toggleSound } = settingsSlice.actions;
export default settingsSlice.reducer;
