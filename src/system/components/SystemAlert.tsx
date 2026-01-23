import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { closeAlert } from '../../store/systemSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AlertBox = styled(motion.div)`
  width: 400px;
  background: rgba(10, 15, 30, 0.95);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const AlertHeader = styled.div`
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props => props.theme.colors.text};
`;

const AlertContent = styled.div`
  padding: 25px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  color: ${props => props.theme.colors.text};
`;

const IconWrapper = styled.div<{ type: string }>`
  color: ${props => {
    switch(props.type) {
      case 'error': return '#ff4d4d';
      case 'warning': return '#ffa726';
      case 'success': return '#66bb6a';
      default: return '#00d8ff';
    }
  }};
`;

const Message = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: ${props => props.theme.colors.accent};
  }

  &.primary {
    background: ${props => props.theme.colors.accent};
    color: black;
    font-weight: 600;
    
    &:hover {
      opacity: 0.9;
      box-shadow: 0 0 10px ${props => props.theme.colors.accent};
    }
  }
`;

const SystemAlert: React.FC = () => {
  const dispatch = useDispatch();
  const alert = useSelector((state: RootState) => state.system.alert);

  if (!alert.isOpen) return null;

  const getIcon = () => {
    switch (alert.type) {
      case 'error': return <XCircle size={32} />;
      case 'warning': return <AlertTriangle size={32} />;
      case 'success': return <CheckCircle size={32} />;
      default: return <Info size={32} />;
    }
  };

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AlertBox
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <AlertHeader>
            {alert.title}
          </AlertHeader>
          <AlertContent>
            <IconWrapper type={alert.type}>
              {getIcon()}
            </IconWrapper>
            <Message>
              {alert.message}
            </Message>
          </AlertContent>
          <ButtonGroup>
            <Button className="primary" onClick={() => dispatch(closeAlert())}>
              OK
            </Button>
          </ButtonGroup>
        </AlertBox>
      </Overlay>
    </AnimatePresence>
  );
};

export default SystemAlert;
