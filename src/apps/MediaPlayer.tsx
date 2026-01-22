import React, { useState } from 'react';
import styled from 'styled-components';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #222;
  color: white;
`;

const Visualizer = styled.div`
  flex: 1;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI';
`;

const Controls = styled.div`
  height: 60px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { color: #0078d7; }
`;

const MediaPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  
  return (
    <Container>
      <Visualizer>
        🎵 Music Visualizer Placeholder
      </Visualizer>
      <Controls>
        <ControlButton><SkipBack size={24} /></ControlButton>
        <ControlButton onClick={() => setPlaying(!playing)}>
          {playing ? <Pause size={32} /> : <Play size={32} />}
        </ControlButton>
        <ControlButton><SkipForward size={24} /></ControlButton>
        <ControlButton><Volume2 size={20} /></ControlButton>
      </Controls>
    </Container>
  );
};

export default MediaPlayer;
