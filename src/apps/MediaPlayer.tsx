import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #000;
  color: white;
  overflow: hidden;
`;

const VideoArea = styled.div`
  flex: 1;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Controls = styled.div`
  height: 60px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  &:hover { opacity: 1; color: ${props => props.theme.colors.accent}; }
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
          backgroundImage: 'linear-gradient(rgba(0, 216, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 216, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          opacity: 0.3,
        }}
      />

      {/* Center Logo */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <motion.div
          animate={playing ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <div style={{ fontSize: 60, fontWeight: 700, fontFamily: 'Rajdhani', color: '#00d8ff', textShadow: '0 0 20px #00d8ff' }}>
            ROOPESH
          </div>
          <div style={{ fontSize: 24, letterSpacing: 5, opacity: 0.8 }}>PORTFOLIO OS</div>
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
            background: '#fff',
            borderRadius: '50%',
            boxShadow: '0 0 10px #fff',
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
