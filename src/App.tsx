import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import Desktop from './system/Desktop';
import { initFileSystem } from './system/FileSystem';
import { initializeContent } from './system/initialContent';
import { ContextMenuProvider } from './system/ContextMenu';

const App: React.FC = () => {
  const themeMode = useSelector((state: RootState) => state.settings.theme);
  const [fsReady, setFsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initFileSystem();
      await initializeContent();
      setFsReady(true);
    };
    init();
  }, []);

  if (!fsReady) {
    return (
      <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI' }}>
        <h3>Booting Roopesh OS...</h3>
      </div>
    );
  }

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <ContextMenuProvider>
        <Desktop />
      </ContextMenuProvider>
    </ThemeProvider>
  );
};

export default App;
