import type { DefaultTheme } from 'styled-components';

// Futuristic / Cyberpunk / Glassmorphism Theme
export const darkTheme: DefaultTheme = {
  colors: {
    background: '#050510',
    taskbar: 'rgba(10, 10, 20, 0.7)',
    taskbarHover: 'rgba(0, 255, 255, 0.15)',
    startMenu: 'rgba(15, 15, 30, 0.85)',
    windowBackground: 'rgba(20, 20, 35, 0.9)',
    text: '#e0e0ff',
    textSecondary: '#a0a0cc',
    accent: '#00d8ff', // Cyan neon
    border: 'rgba(0, 216, 255, 0.3)',
    selection: 'rgba(0, 216, 255, 0.2)',
    hover: 'rgba(0, 216, 255, 0.1)',
  },
  sizes: {
    taskbarHeight: '48px',
  },
};

// Keeping light theme simple but slightly modernized
export const lightTheme: DefaultTheme = {
  colors: {
    background: '#f0f4f8',
    taskbar: 'rgba(255, 255, 255, 0.8)',
    taskbarHover: 'rgba(0, 0, 0, 0.05)',
    startMenu: 'rgba(255, 255, 255, 0.9)',
    windowBackground: 'rgba(255, 255, 255, 0.95)',
    text: '#1a1a2e',
    textSecondary: '#555577',
    accent: '#0078d7',
    border: '#d1d9e6',
    selection: 'rgba(0, 120, 215, 0.2)',
    hover: 'rgba(0, 0, 0, 0.05)',
  },
  sizes: {
    taskbarHeight: '48px',
  },
};
