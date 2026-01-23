import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
}

export interface SystemState {
  alert: AlertState;
  isShutDown: boolean;
}

const initialState: SystemState = {
  alert: {
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  },
  isShutDown: false,
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setShutdown: (state, action: PayloadAction<boolean>) => {
      state.isShutDown = action.payload;
    },
    showAlert: (state, action: PayloadAction<{ title?: string; message: string; type?: AlertState['type'] }>) => {
      state.alert = {
        isOpen: true,
        title: action.payload.title || 'System',
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    closeAlert: (state) => {
      state.alert.isOpen = false;
    },
  },
});

export const { showAlert, closeAlert, setShutdown } = systemSlice.actions;
export default systemSlice.reducer;
