import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { minimizeProcess, focusProcess } from '../store/processSlice';
import { Menu, Wifi, Volume2, Battery, Info, Grid } from 'lucide-react';
import StartMenu from './StartMenu';
import QuickSettingsPopup from './components/tray/QuickSettingsPopup';
import CalendarPopup from './components/tray/CalendarPopup';
import InfoPopup from './components/tray/InfoPopup';
import Launchpad from './components/Launchpad';

const TaskbarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${props => props.theme.sizes.taskbarHeight};
  background: ${props => props.theme.colors.taskbar};
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;
  border-top: 3px solid ${props => props.theme.colors.border};
  box-shadow: 0 -4px 0 ${props => props.theme.colors.border};
`;

const StartButton = styled.div`
  width: 56px;
  height: calc(100% - 12px);
  margin: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 #000;
  }
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #000;
  }
  transition: all 0.1s ease;
  
  svg {
    color: #000;
  }
`;

const TaskbarItems = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;

const TaskbarEntry = styled.div<{ $active: boolean }>`
  min-width: 160px;
  height: calc(100% - 12px);
  margin: 6px 0 6px 6px;
  display: flex;
  padding: 0 14px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  background: ${props => props.$active 
    ? (props.theme.colors.brutalistGreen || '#6bcb77')
    : (props.theme.colors.brutalistBlue || '#4d96ff')};
  border: 3px solid #000;
  box-shadow: ${props => props.$active ? '4px 4px 0 #000' : '2px 2px 0 #000'};
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;
  font-family: 'Rajdhani', sans-serif;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #000;
  }
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #000;
  }
  transition: all 0.1s ease;
`;

const Tray = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding-right: 10px;
  gap: 8px;
  font-size: 12px;
`;

const TrayIcon = styled.div`
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #000;
  }
  
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }
  
  svg {
    color: #000;
  }
`;

const Clock = ({ onClick }: { onClick: () => void }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div onClick={onClick} style={{ textAlign: 'center', lineHeight: '1.2', cursor: 'pointer', padding: '0 8px', color: '#000', fontWeight: 700 }}>
      <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div style={{ fontSize: 10, color: '#000' }}>{time.toLocaleDateString()}</div>
    </div>
  );
};

const Taskbar: React.FC = () => {
  const dispatch = useDispatch();
  const processes = useSelector((state: RootState) => state.process.processes);
  const activeId = useSelector((state: RootState) => state.process.activeId);
  
  // Exclusive popup state
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const togglePopup = (name: string) => {
    setActivePopup(activePopup === name ? null : name);
  };

  return (
    <>
      {activePopup && activePopup !== 'launchpad' && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9990 }} 
          onClick={() => setActivePopup(null)} 
        />
      )}
      {activePopup === 'start' && <StartMenu onClose={() => setActivePopup(null)} />}
      {activePopup === 'settings' && <QuickSettingsPopup />}
      {activePopup === 'calendar' && <CalendarPopup />}
      {activePopup === 'info' && <InfoPopup />}
      {activePopup === 'launchpad' && <Launchpad onClose={() => setActivePopup(null)} />}
      
      <TaskbarContainer>
        <StartButton onClick={() => togglePopup('start')}>
          <Menu size={22} />
        </StartButton>
        <StartButton onClick={() => togglePopup('launchpad')}>
          <Grid size={20} />
        </StartButton>
        <TaskbarItems>
          {Object.values(processes).map(process => (
            <TaskbarEntry 
              key={process.id} 
              $active={activeId === process.id && !process.minimized}
              onClick={() => {
                if (activeId === process.id && !process.minimized) {
                  dispatch(minimizeProcess(process.id));
                } else {
                  dispatch(focusProcess(process.id));
                }
              }}
              title={process.title}
            >
              <img src={process.icon} style={{width: 20, height: 20}} alt="" onError={(e) => e.currentTarget.style.display = 'none'} />
              <span>{process.title}</span>
            </TaskbarEntry>
          ))}
        </TaskbarItems>
        <Tray>
          <TrayIcon onClick={() => togglePopup('info')}>
             <Info size={18} />
          </TrayIcon>

          <TrayIcon onClick={() => togglePopup('settings')}>
             <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
               <Wifi size={16} />
               <Volume2 size={16} />
               <Battery size={16} />
             </div>
          </TrayIcon>

          <TrayIcon onClick={() => togglePopup('calendar')}>
             <Clock onClick={() => {}} />
          </TrayIcon>
        </Tray>
      </TaskbarContainer>
    </>
  );
};

export default Taskbar;
