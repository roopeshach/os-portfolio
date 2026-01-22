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
      border: string;
      selection: string;
      hover: string;
    };
    sizes: {
      taskbarHeight: string;
    };
  }
}
