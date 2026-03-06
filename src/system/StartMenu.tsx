import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { setShutdown, showModal } from '../store/systemSlice';
import { AppMetadata } from '../apps/registry';
import { Power } from 'lucide-react';
import { registerModalCallback } from './components/SystemModal';

const StartMenuContainer = styled.div`
  position: absolute;
  bottom: 56px; /* Taskbar height */
  left: 10px;
  width: 350px;
  height: 500px;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  border: 3px solid #000;
  box-shadow: 8px 8px 0 #000;
  display: flex;
  flex-direction: row;
  z-index: 9998;
  animation: slideUp 0.15s ease-out;

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
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  border-right: 3px solid #000;
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
  border: 3px solid #000;
  gap: 10px;
  color: #000;
  font-weight: 700;
  background: ${props => props.theme.colors.brutalistGreen || '#6bcb77'};
  margin-bottom: 8px;
  box-shadow: 3px 3px 0 #000;
  
  &:hover {
    background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 #000;
  }
  transition: all 0.1s ease;
  
  svg {
    color: #000;
  }
`;

const PowerButton = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
  border: 3px solid #000;
  box-shadow: 2px 2px 0 #000;
  color: #000;
  
  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #000;
  }
`;

interface StartMenuProps {
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose }) => {
  const dispatch = useDispatch();

  const handleShutdown = () => {
    const callbackId = `shutdown_${Date.now()}`;
    registerModalCallback(callbackId, (confirmed) => {
      if (confirmed) {
        dispatch(setShutdown(true));
        onClose();
      }
    });
    dispatch(showModal({
      type: 'confirm',
      title: 'Shut Down',
      message: 'All unsaved data will be lost. Are you sure you want to shut down?',
      confirmText: 'Shut Down',
      cancelText: 'Cancel',
      callbackId,
    }));
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
