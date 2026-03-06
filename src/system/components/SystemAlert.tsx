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
  background: rgba(0, 0, 0, 0.6);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AlertBox = styled(motion.div)`
  width: 400px;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const AlertHeader = styled.div`
  height: 45px;
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  display: flex;
  align-items: center;
  padding: 0 15px;
  border-bottom: 3px solid #000;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #000;
`;

const AlertContent = styled.div`
  padding: 25px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  color: #000;
`;

const IconWrapper = styled.div<{ type: string }>`
  color: #000;
  background: ${props => {
    switch(props.type) {
      case 'error': return '#ff6b9d';
      case 'warning': return '#ff9f43';
      case 'success': return '#6bcb77';
      default: return '#4d96ff';
    }
  }};
  padding: 8px;
  border: 3px solid #000;
`;

const Message = styled.div`
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 600;
  color: #000;
`;

const ButtonGroup = styled.div`
  padding: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: ${props => props.theme.colors.brutalistGreen || '#6bcb77'};
  border-top: 3px solid #000;
`;

const Button = styled.button`
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  border: 3px solid #000;
  color: #000;
  padding: 8px 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
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

  &.primary {
    background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0 #000;
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
