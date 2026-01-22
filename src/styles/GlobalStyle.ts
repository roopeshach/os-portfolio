import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

  * {
    box-sizing: border-box;
    user-select: none; /* Desktop feel */
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Rajdhani', 'Segoe UI', sans-serif;
    font-size: 16px;
    font-weight: 500;
    overflow: hidden; /* Prevent body scroll, everything is in desktop */
    background-color: #000;
    color: ${({ theme }) => theme.colors.text};
  }

  code, pre, textarea {
    font-family: 'Fira Code', monospace !important;
  }

  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.accent};
    border-radius: 4px;
    opacity: 0.5;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text};
  }
`;
