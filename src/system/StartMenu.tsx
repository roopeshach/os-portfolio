import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { AppMetadata } from '../apps/registry';
import { Power } from 'lucide-react';

const StartMenuContainer = styled.div`
  position: absolute;
  bottom: 40px; /* Taskbar height */
  left: 0;
  width: 350px;
  height: 500px;
  background: ${props => props.theme.colors.startMenu};
  backdrop-filter: blur(15px);
  border-top-right-radius: 5px;
  display: flex;
  flex-direction: row; /* Change to row to put sidebar and list side-by-side */
  z-index: 9998;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  animation: slideUp 0.2s ease-out;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Sidebar = styled.div`
  width: 50px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 10px;
`;

const AppList = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const AppEntry = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  gap: 10px;
  color: ${props => props.theme.colors.text};
  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const PowerButton = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleLaunch = (appName: string) => {
    const meta = AppMetadata[appName as keyof typeof AppMetadata];
    dispatch(openProcess({
      appId: appName,
      title: meta.title,
      icon: meta.icon,
      componentName: appName,
    }));
    onClose();
  };

  // Close on click outside (simplified)
  React.useEffect(() => {
    // Logic moved to overlay or parent
  }, []);

  return (
    <StartMenuContainer id="start-menu">
      <Sidebar>
        <PowerButton>
            <Power size={20} />
        </PowerButton>
      </Sidebar>
      <AppList>
        {Object.keys(AppMetadata).map(appName => {
             const meta = AppMetadata[appName as keyof typeof AppMetadata];
             return (
              <AppEntry key={appName} onClick={() => handleLaunch(appName)}>
                <img src={meta.icon} style={{width: 24, height: 24}} alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
                <span>{meta.title}</span>
              </AppEntry>
             );
        })}
      </AppList>
    </StartMenuContainer>
  );
};

export default StartMenu;
