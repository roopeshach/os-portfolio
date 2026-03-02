import type { DefaultTheme } from 'styled-components';

// Dark Theme - Rich Brown & Lime with enhanced visual depth
export const darkTheme: DefaultTheme = {
  colors: {
    background: '#2A1810', // Deeper Brown for contrast
    taskbar: 'rgba(30, 15, 10, 0.85)',
    taskbarHover: '#CED979', // Lime Green
    startMenu: 'rgba(45, 26, 21, 0.95)',
    windowBackground: 'rgba(60, 35, 28, 0.92)',
    text: '#E8E8E8', // Brighter text
    textSecondary: '#CEB67E', // Tan
    accent: '#CED979', // Lime Green
    accentGlow: 'rgba(206, 217, 121, 0.4)',
    border: 'rgba(206, 217, 121, 0.25)',
    selection: '#CED979',
    hover: '#CED979',
    glassBg: 'rgba(45, 26, 21, 0.7)',
    glassBlur: '20px',
    shadow: 'rgba(0, 0, 0, 0.4)',
    glow: 'rgba(206, 217, 121, 0.3)',
  },
  sizes: {
    taskbarHeight: '52px',
  },
};

// Light Theme - Silver & Lime with enhanced visual depth
export const lightTheme: DefaultTheme = {
  colors: {
    background: '#C8C8C8', // Light Gray
    taskbar: 'rgba(200, 200, 200, 0.85)',
    taskbarHover: '#CED979', // Lime Green
    startMenu: 'rgba(210, 210, 210, 0.95)',
    windowBackground: 'rgba(220, 220, 220, 0.92)',
    text: '#2A1810', // Darker Brown for contrast
    textSecondary: '#5C3830', // Lighter Brown
    accent: '#B8C260', // Slightly darker lime for light theme
    accentGlow: 'rgba(184, 194, 96, 0.4)',
    border: 'rgba(100, 100, 100, 0.3)',
    selection: '#CEB67E', // Tan
    hover: '#CEB67E', // Tan
    glassBg: 'rgba(220, 220, 220, 0.7)',
    glassBlur: '20px',
    shadow: 'rgba(0, 0, 0, 0.15)',
    glow: 'rgba(184, 194, 96, 0.3)',
  },
  sizes: {
    taskbarHeight: '52px',
  },
};