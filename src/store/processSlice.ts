import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ProcessState {
  id: string;
  appId: string;
  title: string;
  icon: string;
  minimized: boolean;
  maximized: boolean;
  componentName: string; // The React component to render
  initialProps?: any;
}

interface SystemState {
  processes: Record<string, ProcessState>;
  stack: string[]; // Order of window IDs (last is on top)
  activeId: string | null;
}

const initialState: SystemState = {
  processes: {},
  stack: [],
  activeId: null,
};

const processSlice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    openProcess: (state, action: PayloadAction<{ appId: string; title: string; icon: string; componentName: string; initialProps?: any }>) => {
      const id = `${action.payload.appId}-${Date.now()}`;
      state.processes[id] = {
        id,
        ...action.payload,
        minimized: false,
        maximized: false,
      };
      state.stack.push(id);
      state.activeId = id;
    },
    closeProcess: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.processes[id];
      state.stack = state.stack.filter((pid) => pid !== id);
      if (state.activeId === id) {
        state.activeId = state.stack[state.stack.length - 1] || null;
      }
    },
    minimizeProcess: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.processes[id]) {
        state.processes[id].minimized = true;
        state.activeId = null; // Remove focus
      }
    },
    maximizeProcess: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.processes[id]) {
        state.processes[id].maximized = !state.processes[id].maximized;
        state.activeId = id;
      }
    },
    restoreProcess: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.processes[id]) {
        state.processes[id].minimized = false;
        state.activeId = id;
        // Move to top of stack
        state.stack = state.stack.filter((pid) => pid !== id);
        state.stack.push(id);
      }
    },
    focusProcess: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.processes[id]) {
        state.activeId = id;
        state.processes[id].minimized = false;
        // Move to top of stack
        state.stack = state.stack.filter((pid) => pid !== id);
        state.stack.push(id);
      }
    },
  },
});

export const { openProcess, closeProcess, minimizeProcess, maximizeProcess, restoreProcess, focusProcess } = processSlice.actions;
export default processSlice.reducer;
