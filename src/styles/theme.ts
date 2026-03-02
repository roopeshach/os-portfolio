import type { DefaultTheme } from 'styled-components';

// Dark Theme - Rich Brown & Lime
export const darkTheme: DefaultTheme = {
  colors: {
    background: '#40251F', // Dark Brown
    taskbar: '#2D1A15',
    taskbarHover: '#CED979', // Lime Green
    startMenu: '#40251F',
    windowBackground: '#4D2E26',
    text: '#BFBFBF', // Light Gray
    textSecondary: '#CEB67E', // Tan
    accent: '#CED979', // Lime Green
    border: '#5C3830',
    selection: '#CED979',
    hover: '#CED979',
  },
  sizes: {
    taskbarHeight: '48px',
  },
};

// Light Theme - Silver & Lime
export const lightTheme: DefaultTheme = {
  colors: {
    background: '#BFBFBF', // Light Gray
    taskbar: '#D0D0D0',
    taskbarHover: '#CED979', // Lime Green
    startMenu: '#C8C8C8',
    windowBackground: '#D5D5D5',
    text: '#40251F', // Dark Brown
    textSecondary: '#5C3830', // Lighter Brown
    accent: '#CED979', // Lime Green
    border: '#8C8C8C', // Medium Gray
    selection: '#CEB67E', // Tan
    hover: '#CEB67E', // Tan
  },
  sizes: {
    taskbarHeight: '48px',
  },
};