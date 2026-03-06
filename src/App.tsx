import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Desktop from './system/Desktop';
import LockScreen from './system/LockScreen';
import { initFileSystem } from './system/FileSystem';
import { initializeContent } from './system/initialContent';
import { ContextMenuProvider } from './system/ContextMenu';

const BrightnessOverlay = styled.div<{ $brightness: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  background: black;
  opacity: ${props => (100 - props.$brightness) / 100};
  z-index: 999999;
  transition: opacity 0.2s ease;
`;

const App: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.settings.theme);
  const brightness = useSelector((state: RootState) => state.settings.brightness);
  const isShutDown = useSelector((state: RootState) => state.system.isShutDown);
  const [fsReady, setFsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initFileSystem();
      await initializeContent();
      setFsReady(true);
    };
    init();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;

      const key = e.key.toLowerCase();
      if (key === 's') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('app:save'));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (!fsReady) {
    return (
      <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI' }}>
        <h3>Booting Roopesh OS...</h3>
      </div>
    );
  }

  if (isShutDown) {
    return (
       <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
         <GlobalStyle />
         <LockScreen />
       </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <BrightnessOverlay $brightness={brightness} />
      <ContextMenuProvider>
        <Desktop />
      </ContextMenuProvider>
    </ThemeProvider>
  );
};

export default App;
