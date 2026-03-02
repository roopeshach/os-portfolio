import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setShutdown } from '../store/systemSlice';
import { Power } from 'lucide-react';
import FireWallpaper from './components/FireWallpaper';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent; /* Wallpaper visible */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  color: ${props => props.theme.colors.text};
  font-family: 'Rajdhani', sans-serif;
`;

const UserAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.accent} 0%, #CEB67E 100%);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  color: #40251F;
  position: relative;
  z-index: 1;
`;

const UserName = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const EnterButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 40px;
  color: #fff;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(10px);
  z-index: 1;
  font-weight: bold;

  &:hover {
    background: ${props => props.theme.colors.accent};
    border-color: ${props => props.theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(206, 217, 121, 0.4);
    color: #40251F;
  }
  &:active {
    transform: translateY(0);
  }
`;

const TimeDisplay = styled.div`
  position: absolute;
  bottom: 50px;
  font-size: 64px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const DateDisplay = styled.div`
  position: absolute;
  bottom: 30px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  z-index: 1;
`;

const LockScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    dispatch(setShutdown(false));
  };

  return (
    <Container>
      <FireWallpaper />
      <UserAvatar>RA</UserAvatar>
      <UserName>Roopesh Acharya</UserName>
      
      <EnterButton onClick={handleEnter}>
        <Power size={18} /> Enter Session
      </EnterButton>

      <TimeDisplay>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </TimeDisplay>
      <DateDisplay>
        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </DateDisplay>
    </Container>
  );
};

export default LockScreen;
