import React from 'react';
import styled from 'styled-components';
import { Wifi, Volume2, Battery, Sun, Monitor, Cpu, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store';
import { setVolume, setBrightness, setTheme } from '../../../store/settingsSlice';
import { openProcess } from '../../../store/processSlice';

const PopupContainer = styled.div`
  position: absolute;
  bottom: 65px;
  right: 10px;
  width: 320px;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  border: 3px solid #000;
  padding: 16px;
  box-shadow: 6px 6px 0 #000;
  z-index: 10000;
  color: #000;
  animation: slideUp 0.15s ease-out;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const SectionTitle = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #000;
  margin-bottom: 8px;
  font-weight: 800;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

  const Tile = styled.div<{ active?: boolean }>`
  background: ${props => props.active ? (props.theme.colors.brutalistPink || '#ff6b9d') : (props.theme.colors.brutalistGreen || '#6bcb77')};
  border: 3px solid #000;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.1s;
  color: #000;
  box-shadow: 3px 3px 0 #000;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 #000;
  }
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }
  
  svg {
    color: #000;
  }
`;

const TileLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #000;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  svg {
    color: #000;
  }
`;

const Slider = styled.input`
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  background: #fff;
  border: 3px solid #000;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
    cursor: pointer;
    border: 3px solid #000;
  }
`;

const ConnectionInfo = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: #000;
  background: #fff;
  padding: 8px;
  border: 2px solid #000;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
`;

const QuickSettingsPopup: React.FC = () => {
  const dispatch = useDispatch();
  const volume = useSelector((state: RootState) => state.settings.volume);
  const brightness = useSelector((state: RootState) => state.settings.brightness);
  const themeMode = useSelector((state: RootState) => state.settings.theme);

  const handlePerformance = () => {
    dispatch(openProcess({
      appId: 'Performance',
      title: 'Performance Monitor',
      icon: '/assets/icons/task-manager.svg',
      componentName: 'Performance',
    }));
  };

  const handleProjects = () => {
    dispatch(openProcess({
      appId: 'Project Navigator',
      title: 'Project Navigator',
      icon: '/assets/icons/folder.svg',
      componentName: 'Project Navigator',
    }));
  };

  return (
    <PopupContainer>
      <div>
        <SectionTitle>Connectivity</SectionTitle>
        <Grid>
          <Tile active>
            <Wifi size={20} />
            <TileLabel>CyberNet_5G</TileLabel>
          </Tile>
          {/* Removed Bluetooth as requested */}
          <Tile onClick={handleProjects}>
            <Monitor size={20} />
            <TileLabel>Project</TileLabel>
          </Tile>
          <Tile onClick={handlePerformance}>
            <Cpu size={20} />
            <TileLabel>Performance</TileLabel>
          </Tile>
          <Tile active={themeMode === 'dark'} onClick={() => dispatch(setTheme(themeMode === 'dark' ? 'light' : 'dark'))}>
            {themeMode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            <TileLabel>{themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</TileLabel>
          </Tile>
        </Grid>
      </div>

      <ConnectionInfo>
        <span>IP: 192.168.1.42</span>
        <span>UP: 950 Mbps</span>
      </ConnectionInfo>

      <div>
        <SectionTitle>Controls</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SliderRow>
            <Volume2 size={16} />
            <Slider 
              type="range" 
              min={0} 
              max={100} 
              value={volume} 
              onChange={(e) => dispatch(setVolume(Number(e.target.value)))} 
            />
          </SliderRow>
          <SliderRow>
            <Sun size={16} />
            <Slider 
              type="range" 
              min={10} 
              max={100} 
              value={brightness} 
              onChange={(e) => dispatch(setBrightness(Number(e.target.value)))} 
            />
          </SliderRow>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, color: '#000', fontWeight: 700 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <Battery size={16} />
          <span>100%</span>
        </div>
        <div style={{ fontSize: 10, color: '#000' }}>EST. 4h 20m</div>
      </div>
    </PopupContainer>
  );
};

export default QuickSettingsPopup;
