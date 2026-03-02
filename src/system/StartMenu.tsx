import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { setShutdown } from '../store/systemSlice';
import { AppMetadata } from '../apps/registry';
import { Power } from 'lucide-react';

const StartMenuContainer = styled.div`
  position: absolute;
  bottom: 48px; /* Taskbar height */
  left: 0;
  width: 350px;
  height: 500px;
  background: ${props => props.theme.colors.startMenu};
  border: 1px solid ${props => props.theme.colors.border};
  border-bottom: none;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: row;
  z-index: 9998;
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
  border: 2px solid transparent;
  border-radius: 8px;
  gap: 10px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  
  &:hover {
    background: ${props => props.theme.colors.hover};
    border: 2px solid ${props => props.theme.colors.border};
    color: #fff;
  }
  transition: all 0.15s ease;
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

  const handleShutdown = () => {
    if (window.confirm('WARNING: All unsaved data will be lost. Are you sure you want to shut down?')) {
       dispatch(setShutdown(true));
       onClose();
    }
  };

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
        <PowerButton onClick={handleShutdown} title="Shut Down">
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
