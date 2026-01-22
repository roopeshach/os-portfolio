import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { minimizeProcess, focusProcess } from '../store/processSlice';
import { Menu, Wifi, Volume2, Battery, Info } from 'lucide-react';
import StartMenu from './StartMenu';
import QuickSettingsPopup from './components/tray/QuickSettingsPopup';
import CalendarPopup from './components/tray/CalendarPopup';
import InfoPopup from './components/tray/InfoPopup';

const TaskbarContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${props => props.theme.sizes.taskbarHeight};
  background: ${props => props.theme.colors.taskbar};
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StartButton = styled.div`
  width: 48px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.colors.taskbarHover};
    box-shadow: 0 0 10px ${props => props.theme.colors.accent};
  }
  transition: all 0.2s ease;
`;

const TaskbarItems = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  padding-left: 10px;
`;

const TaskbarEntry = styled.div<{ $active: boolean }>`
  width: 48px; /* Or variable width with text */
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.accent : 'transparent'};
  cursor: pointer;
  &:hover {
    background: ${props => props.theme.colors.taskbarHover};
    box-shadow: inset 0 -2px 5px ${props => props.theme.colors.accent};
  }
  margin-right: 2px;
  transition: all 0.2s ease;
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
  border-radius: 4px;
  &:hover {
    background: ${props => props.theme.colors.taskbarHover};
  }
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Clock = ({ onClick }: { onClick: () => void }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div onClick={onClick} style={{ textAlign: 'center', lineHeight: '1.2', cursor: 'pointer', padding: '0 8px' }}>
      <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div style={{ fontSize: 10 }}>{time.toLocaleDateString()}</div>
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
      {activePopup === 'start' && <StartMenu onClose={() => setActivePopup(null)} />}
      {activePopup === 'settings' && <QuickSettingsPopup />}
      {activePopup === 'calendar' && <CalendarPopup />}
      {activePopup === 'info' && <InfoPopup />}
      
      <TaskbarContainer>
        <StartButton onClick={() => togglePopup('start')}>
          <Menu color="#00d8ff" style={{ filter: 'drop-shadow(0 0 5px #00d8ff)' }} />
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
            </TaskbarEntry>
          ))}
        </TaskbarItems>
        <Tray>
          <TrayIcon onClick={() => togglePopup('info')}>
             <Info size={18} color="#00d8ff" />
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
