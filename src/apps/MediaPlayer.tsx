import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  color: #000;
  overflow: hidden;
`;

const VideoArea = styled.div`
  flex: 1;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 3px solid #000;
`;

const Controls = styled.div`
  height: 60px;
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-top: 3px solid #000;
`;

const ControlButton = styled.button`
  background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
  border: 3px solid #000;
  color: #000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-shadow: 3px 3px 0 #000;
  transition: all 0.1s;
  &:hover { 
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0 #000;
  }
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }
`;

const IntroAnimation = ({ playing }: { playing: boolean }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Background Grid */}
      <motion.div
        animate={playing ? { 
          backgroundPosition: ['0% 0%', '100% 100%'],
        } : {}}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: -50, left: -50, right: -50, bottom: -50,
          backgroundImage: 'linear-gradient(rgba(206, 217, 121, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(206, 217, 121, 0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          opacity: 0.4,
        }}
      />

      {/* Center Logo */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <motion.div
          animate={playing ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div style={{ fontSize: 60, fontWeight: 700, fontFamily: 'Rajdhani', color: '#CED979', textShadow: '0 0 30px rgba(206, 217, 121, 0.5)' }}>
            ROOPESH
          </div>
          <div style={{ fontSize: 24, letterSpacing: 5, opacity: 0.8, color: '#BFBFBF' }}>PORTFOLIO OS</div>
        </motion.div>
      </div>

      {/* Floating Particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={playing ? {
            y: [0, -100, 0],
            x: [0, ((i * 1337) % 50) - 25, 0], // Deterministic random-like value
            opacity: [0, 1, 0],
          } : {}}
          transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '60%',
            left: `${40 + i * 5}%`,
            width: 4,
            height: 4,
            background: '#CED979',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(206, 217, 121, 0.6)',
          }}
        />
      ))}
    </div>
  );
};

const MediaPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(true);
  
  return (
    <Container>
      <VideoArea>
        <IntroAnimation playing={playing} />
        <div style={{ position: 'absolute', bottom: 20, left: 20, fontSize: 12, opacity: 0.5 }}>
          Intro.mp4 (React Component Render)
        </div>
      </VideoArea>
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
