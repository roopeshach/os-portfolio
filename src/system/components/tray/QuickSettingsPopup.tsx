import React from 'react';
import styled from 'styled-components';
import { Wifi, Volume2, Battery, Sun, Monitor, Cpu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store';
import { setVolume, setBrightness } from '../../../store/settingsSlice';
import { openProcess } from '../../../store/processSlice';

const PopupContainer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 10px;
  width: 320px;
  background: ${props => props.theme.colors.windowBackground};
  border: 3px solid #000;
  border-radius: 0;
  padding: 16px;
  box-shadow: 8px 8px 0px #000;
  z-index: 10000;
  color: ${props => props.theme.colors.text};
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

  const Tile = styled.div<{ active?: boolean }>`
  background: ${props => props.active ? props.theme.colors.accent : '#fff'};
  border: 2px solid #000;
  border-radius: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.1s;
  color: ${props => props.active ? '#fff' : '#000'};
  box-shadow: 4px 4px 0px #000;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000;
  }
  &:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px #000;
  }
`;

const TileLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Slider = styled.input`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${props => props.theme.colors.accent};
    cursor: pointer;
    box-shadow: 0 0 10px ${props => props.theme.colors.accent};
  }
`;

const ConnectionInfo = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: ${props => props.theme.colors.accent};
  background: rgba(0, 0, 0, 0.3);
  padding: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
`;

const QuickSettingsPopup: React.FC = () => {
  const dispatch = useDispatch();
  const volume = useSelector((state: RootState) => state.settings.volume);
  const brightness = useSelector((state: RootState) => state.settings.brightness);

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
            <Wifi size={20} color="#D2691E" />
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
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <Battery size={16} />
          <span>100%</span>
        </div>
        <div style={{ fontSize: 10, color: '#aaa' }}>EST. 4h 20m</div>
      </div>
    </PopupContainer>
  );
};

export default QuickSettingsPopup;
