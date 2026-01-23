import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setShutdown } from '../store/systemSlice';
import { Power } from 'lucide-react';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  opacity: 0.5;
  z-index: -1;
`;

const UserAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 216, 255, 0.2);
`;

const UserName = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: 500;
`;

const EnterButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 40px;
  color: #fff;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Rajdhani', sans-serif;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const TimeDisplay = styled.div`
  position: absolute;
  bottom: 50px;
  font-size: 64px;
  font-weight: 100;
`;

const DateDisplay = styled.div`
  position: absolute;
  bottom: 30px;
  font-size: 18px;
  color: #aaa;
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
      <Background />
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
