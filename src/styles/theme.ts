import type { DefaultTheme } from 'styled-components';

// Soft Dark Theme - Elegant Charcoal & Coral
export const darkTheme: DefaultTheme = {
  colors: {
    background: '#2D3436', // Soft Charcoal
    taskbar: '#1E272E',
    taskbarHover: '#E17055', // Soft Coral
    startMenu: '#2D3436',
    windowBackground: '#2D3436',
    text: '#F5F6FA', // Soft White
    textSecondary: '#E17055',
    accent: '#E17055', // Soft Coral
    border: '#636E72',
    selection: '#E17055',
    hover: '#E17055',
  },
  sizes: {
    taskbarHeight: '48px',
  },
};

// Modern Light Theme - Soft Cream & Coral
export const lightTheme: DefaultTheme = {
  colors: {
    background: '#FAFAFA', // Soft White
    taskbar: '#FFFFFF',
    taskbarHover: '#FF7675', // Light Coral
    startMenu: '#FFFFFF',
    windowBackground: '#FFFFFF',
    text: '#2D3436', // Soft Dark
    textSecondary: '#E17055', // Soft Coral
    accent: '#E17055', // Soft Coral
    border: '#DFE6E9', // Light Gray Border
    selection: '#FF7675',
    hover: '#FF7675',
  },
  sizes: {
    taskbarHeight: '48px',
  },
};