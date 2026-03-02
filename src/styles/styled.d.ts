import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      taskbar: string;
      taskbarHover: string;
      startMenu: string;
      windowBackground: string;
      text: string;
      textSecondary: string;
      accent: string;
      accentGlow?: string;
      border: string;
      selection: string;
      hover: string;
      glassBg?: string;
      glassBlur?: string;
      shadow?: string;
      glow?: string;
    };
    sizes: {
      taskbarHeight: string;
    };
  }
}
