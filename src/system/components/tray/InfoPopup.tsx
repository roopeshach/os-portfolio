import React from 'react';
import styled from 'styled-components';
import { Layers, Box, Cpu, Code } from 'lucide-react';

const PopupContainer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 10px;
  width: 300px;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 30px rgba(0, 216, 255, 0.15);
  z-index: 10000;
  color: ${props => props.theme.colors.text};
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Title = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  color: ${props => props.theme.colors.accent};
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
`;

const Label = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 12px;
`;

const Value = styled.div`
  font-weight: 500;
`;

const Tag = styled.span`
  background: rgba(0, 216, 255, 0.1);
  color: ${props => props.theme.colors.accent};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  margin-right: 5px;
  border: 1px solid rgba(0, 216, 255, 0.2);
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
