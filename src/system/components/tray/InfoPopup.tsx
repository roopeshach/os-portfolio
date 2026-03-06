import React from 'react';
import styled from 'styled-components';
import { Layers, Box, Cpu, Code } from 'lucide-react';

const PopupContainer = styled.div`
  position: absolute;
  bottom: 65px;
  right: 10px;
  width: 300px;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  border: 3px solid #000;
  padding: 20px;
  box-shadow: 6px 6px 0 #000;
  z-index: 10000;
  color: #000;
  animation: slideUp 0.15s ease-out;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 3px solid #000;
  padding-bottom: 10px;
  font-weight: 800;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  
  svg {
    color: #000;
  }
`;

const Label = styled.div`
  color: #333;
  font-size: 12px;
  font-weight: 600;
`;

const Value = styled.div`
  font-weight: 800;
  color: #000;
`;

const Tag = styled.span`
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  color: #000;
  padding: 2px 6px;
  font-size: 10px;
  margin-right: 5px;
  border: 2px solid #000;
  font-weight: 700;
`;

const InfoPopup: React.FC = () => {
  return (
    <PopupContainer>
      <Title>System Architecture</Title>
      
      <InfoItem>
        <Box size={20} color="#00d8ff" />
        <div>
          <Label>Frontend Framework</Label>
          <Value>React 18 + TypeScript</Value>
        </div>
      </InfoItem>

      <InfoItem>
        <Layers size={20} color="#00d8ff" />
        <div>
          <Label>State Management</Label>
          <Value>Redux Toolkit</Value>
        </div>
      </InfoItem>

      <InfoItem>
        <Code size={20} color="#00d8ff" />
        <div>
          <Label>Styling Engine</Label>
          <Value>Styled Components</Value>
        </div>
      </InfoItem>

      <InfoItem>
        <Cpu size={20} color="#00d8ff" />
        <div>
          <Label>File System</Label>
          <Value>BrowserFS (IndexedDB)</Value>
        </div>
      </InfoItem>

      <div style={{ marginTop: 15, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Label style={{ marginBottom: 5 }}>Tech Stack</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          <Tag>Vite</Tag>
          <Tag>React Draggable</Tag>
          <Tag>XTerm.js</Tag>
          <Tag>Monaco</Tag>
          <Tag>Framer Motion</Tag>
        </div>
      </div>
    </PopupContainer>
  );
};

export default InfoPopup;
