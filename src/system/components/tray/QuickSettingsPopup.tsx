import React from 'react';
import styled from 'styled-components';
import { Wifi, Volume2, Battery, Bluetooth, Sun, Monitor, Cpu } from 'lucide-react';

const PopupContainer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 10px;
  width: 320px;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 30px rgba(0, 216, 255, 0.15);
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
  background: ${props => props.active ? 'rgba(0, 216, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.active ? props.theme.colors.accent : 'transparent'};
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? 'rgba(0, 216, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
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
  return (
    <PopupContainer>
      <div>
        <SectionTitle>Connectivity</SectionTitle>
        <Grid>
          <Tile active>
            <Wifi size={20} color="#00d8ff" />
            <TileLabel>CyberNet_5G</TileLabel>
          </Tile>
          <Tile>
            <Bluetooth size={20} />
            <TileLabel>Bluetooth</TileLabel>
          </Tile>
          <Tile>
            <Monitor size={20} />
            <TileLabel>Project</TileLabel>
          </Tile>
          <Tile>
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
            <Slider type="range" defaultValue={70} />
          </SliderRow>
          <SliderRow>
            <Sun size={16} />
            <Slider type="range" defaultValue={90} />
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
