import type { DefaultTheme } from 'styled-components';

// Soil/Orange Dark Theme
export const darkTheme: DefaultTheme = {
  colors: {
    background: '#262421', // Peat
    taskbar: '#1E1C1A',
    taskbarHover: '#D2691E', // Chocolate (Soil Orange)
    startMenu: '#262421',
    windowBackground: '#262421',
    text: '#E6DCCF', // Light Sand
    textSecondary: '#D2691E',
    accent: '#D2691E', // Chocolate
    border: '#000000',
    selection: '#D2691E',
    hover: '#D2691E',
  },
  sizes: {
    taskbarHeight: '48px',
  },
};

// Soil/Orange Light Theme
export const lightTheme: DefaultTheme = {
  colors: {
    background: '#E6DCCF', // Light Sand
    taskbar: '#E6DCCF',
    taskbarHover: '#D2691E',
    startMenu: '#E6DCCF',
    windowBackground: '#F0EBE5',
    text: '#1E1C1A',
    textSecondary: '#8B4513', // SaddleBrown
    accent: '#D2691E', // Chocolate
    border: '#000000',
    selection: '#D2691E',
    hover: '#D2691E',
  },
  sizes: {
    taskbarHeight: '48px',
  },
};