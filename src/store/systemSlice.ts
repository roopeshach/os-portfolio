import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
}

export interface ModalState {
  isOpen: boolean;
  type: 'prompt' | 'confirm';
  title: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  callbackId: string | null;
}

export interface SystemState {
  alert: AlertState;
  modal: ModalState;
  isShutDown: boolean;
}

const initialState: SystemState = {
  alert: {
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  },
  modal: {
    isOpen: false,
    type: 'prompt',
    title: '',
    message: '',
    defaultValue: '',
    placeholder: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    callbackId: null,
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
    showModal: (state, action: PayloadAction<{
      type: 'prompt' | 'confirm';
      title: string;
      message: string;
      defaultValue?: string;
      placeholder?: string;
      confirmText?: string;
      cancelText?: string;
      callbackId: string;
    }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        defaultValue: action.payload.defaultValue || '',
        placeholder: action.payload.placeholder || '',
        confirmText: action.payload.confirmText || 'OK',
        cancelText: action.payload.cancelText || 'Cancel',
        callbackId: action.payload.callbackId,
      };
    },
    closeModal: (state) => {
      state.modal.isOpen = false;
      state.modal.callbackId = null;
    },
  },
});

export const { showAlert, closeAlert, setShutdown, showModal, closeModal } = systemSlice.actions;
export default systemSlice.reducer;
