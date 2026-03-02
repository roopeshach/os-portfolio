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
  backdrop-filter: blur(${props => props.theme.colors.glassBlur || '20px'});
  -webkit-backdrop-filter: blur(${props => props.theme.colors.glassBlur || '20px'});
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 9999;
  border-top: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 -4px 30px ${props => props.theme.colors.shadow || 'rgba(0, 0, 0, 0.2)'},
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

const StartButton = styled.div`
  width: 52px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-right: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, ${props => props.theme.colors.accentGlow || 'rgba(206, 217, 121, 0.3)'} 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.theme.colors.accent};
    box-shadow: 0 0 20px ${props => props.theme.colors.accentGlow || 'rgba(206, 217, 121, 0.5)'};
    
    &::before {
      opacity: 1;
    }
  }
  &:active {
    background: ${props => props.theme.colors.accent};
    transform: scale(0.95);
  }
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const TaskbarItems = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`;

const TaskbarEntry = styled.div<{ $active: boolean }>`
  width: 180px;
  height: calc(100% - 8px);
  margin: 4px 4px 4px 0;
  display: flex;
  padding: 0 12px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  background: ${props => props.$active 
    ? `linear-gradient(135deg, ${props.theme.colors.accent} 0%, ${props.theme.colors.hover} 100%)`
    : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$active 
    ? props.theme.colors.accent 
    : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  color: ${props => props.$active ? '#1a1a1a' : props.theme.colors.text};
  position: relative;
  overflow: hidden;
  
  ${props => props.$active && `
    box-shadow: 0 2px 12px ${props.theme.colors.accentGlow || 'rgba(206, 217, 121, 0.4)'},
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
  `}
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: ${props => props.$active ? '40%' : '0'};
    height: 2px;
    background: ${props => props.theme.colors.accent};
    border-radius: 1px;
    transition: width 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.$active 
      ? `linear-gradient(135deg, ${props.theme.colors.accent} 0%, ${props.theme.colors.hover} 100%)`
      : 'rgba(255, 255, 255, 0.1)'};
    
    &::after {
      width: 60%;
    }
  }
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
  padding: 10px;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    
    svg {
      filter: drop-shadow(0 0 8px ${props => props.theme.colors.accent});
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
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
