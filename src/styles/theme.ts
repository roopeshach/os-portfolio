import type { DefaultTheme } from 'styled-components';

// Neubrutalism Dark Theme - Bold colors, hard shadows, thick borders
export const darkTheme: DefaultTheme = {
  colors: {
    background: '#1a1a2e', // Deep navy
    taskbar: '#16213e',
    taskbarHover: '#ffd93d', // Bright yellow
    startMenu: '#1a1a2e',
    windowBackground: '#0f0f23',
    text: '#ffffff',
    textSecondary: '#b8b8d1',
    accent: '#ffd93d', // Bright yellow
    accentGlow: 'transparent',
    border: '#000000',
    selection: '#ff6b6b', // Coral red
    hover: '#6bcb77', // Mint green
    glassBg: '#1a1a2e',
    glassBlur: '0px',
    shadow: '#000000',
    glow: 'transparent',
    // Neubrutalism specific
    brutalistYellow: '#ffd93d',
    brutalistBlue: '#4d96ff',
    brutalistPink: '#ff6b9d',
    brutalistGreen: '#6bcb77',
    brutalistOrange: '#ff9f43',
    brutalistPurple: '#a66cff',
  },
  sizes: {
    taskbarHeight: '56px',
  },
};

// Neubrutalism Light Theme - Bold colors, hard shadows, thick borders
export const lightTheme: DefaultTheme = {
  colors: {
    background: '#fffbe6', // Cream/off-white
    taskbar: '#ffd93d', // Bright yellow taskbar
    taskbarHover: '#ff6b6b',
    startMenu: '#ffffff',
    windowBackground: '#ffffff',
    text: '#1a1a2e',
    textSecondary: '#4a4a68',
    accent: '#4d96ff', // Bright blue
    accentGlow: 'transparent',
    border: '#000000',
    selection: '#ff6b9d', // Pink
    hover: '#6bcb77', // Green
    glassBg: '#ffffff',
    glassBlur: '0px',
    shadow: '#000000',
    glow: 'transparent',
    // Neubrutalism specific
    brutalistYellow: '#ffd93d',
    brutalistBlue: '#4d96ff',
    brutalistPink: '#ff6b9d',
    brutalistGreen: '#6bcb77',
    brutalistOrange: '#ff9f43',
    brutalistPurple: '#a66cff',
  },
  sizes: {
    taskbarHeight: '56px',
  },
};