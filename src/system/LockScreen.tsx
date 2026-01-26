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
  border-radius: 0; /* Brutalist Square */
  background: ${props => props.theme.colors.windowBackground};
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  border: 3px solid #000;
  box-shadow: 8px 8px 0px #000;
  color: ${props => props.theme.colors.text};
  position: relative;
  z-index: 1;
`;

const UserName = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: 700;
  text-shadow: 2px 2px 0px #000;
  z-index: 1;
`;

const EnterButton = styled.button`
  background: ${props => props.theme.colors.windowBackground};
  border: 3px solid #000;
  padding: 12px 40px;
  color: ${props => props.theme.colors.text};
  font-size: 18px;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.1s;
  font-family: 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 6px 6px 0px #000;
  z-index: 1;
  font-weight: bold;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px #000;
    background: ${props => props.theme.colors.accent};
    color: #fff;
  }
  &:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px #000;
  }
`;

const TimeDisplay = styled.div`
  position: absolute;
  bottom: 50px;
  font-size: 64px;
  font-weight: 900;
  color: ${props => props.theme.colors.text};
  text-shadow: 4px 4px 0px #000;
  z-index: 1;
`;

const DateDisplay = styled.div`
  position: absolute;
  bottom: 30px;
  font-size: 18px;
  color: ${props => props.theme.colors.textSecondary};
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
