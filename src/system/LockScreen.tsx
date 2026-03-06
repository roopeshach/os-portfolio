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
  color: #000;
  font-family: 'Rajdhani', sans-serif;
`;

const UserAvatar = styled.div`
  width: 120px;
  height: 120px;
  background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
  border: 4px solid #000;
  box-shadow: 6px 6px 0 #000;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 900;
  color: #000;
  position: relative;
  z-index: 1;
`;

const UserName = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: 900;
  color: #000;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  padding: 10px 30px;
  border: 4px solid #000;
  box-shadow: 5px 5px 0 #000;
  z-index: 1;
`;

const EnterButton = styled.button`
  background: ${props => props.theme.colors.brutalistGreen || '#6bcb77'};
  border: 4px solid #000;
  padding: 15px 50px;
  color: #000;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.1s ease;
  font-family: 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1;
  font-weight: 900;
  box-shadow: 5px 5px 0 #000;
  text-transform: uppercase;

  &:hover {
    background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
    transform: translate(-3px, -3px);
    box-shadow: 8px 8px 0 #000;
  }
  &:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }
`;

const TimeDisplay = styled.div`
  position: absolute;
  bottom: 80px;
  font-size: 64px;
  font-weight: 900;
  color: #000;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  padding: 10px 40px;
  border: 4px solid #000;
  box-shadow: 6px 6px 0 #000;
  z-index: 1;
`;

const DateDisplay = styled.div`
  position: absolute;
  bottom: 50px;
  font-size: 18px;
  color: #000;
  font-weight: 800;
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  padding: 5px 20px;
  border: 3px solid #000;
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
