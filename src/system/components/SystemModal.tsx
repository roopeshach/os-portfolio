import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { closeModal } from '../../store/systemSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, HelpCircle } from 'lucide-react';

// Global callback registry for modal responses
type ModalCallback = (value: string | boolean | null) => void;
const modalCallbacks: Map<string, ModalCallback> = new Map();

export const registerModalCallback = (id: string, callback: ModalCallback) => {
  modalCallbacks.set(id, callback);
};

export const unregisterModalCallback = (id: string) => {
  modalCallbacks.delete(id);
};

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100001;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled(motion.div)`
  width: 420px;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  height: 48px;
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: #000;
  border-bottom: 3px solid #000;
`;

const ModalContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #000;
`;

const Message = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #000;
  font-weight: 600;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 800;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: #fff;
  border: 3px solid #000;
  color: #000;
  font-size: 14px;
  font-family: 'Fira Code', monospace;
  outline: none;
  transition: all 0.1s ease;
  font-weight: 500;

  &:focus {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 #000;
  }

  &::placeholder {
    color: #666;
    opacity: 0.8;
  }
`;

const ButtonGroup = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: ${props => props.theme.colors.brutalistGreen || '#6bcb77'};
  border-top: 3px solid #000;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  font-family: 'Rajdhani', sans-serif;
  transition: all 0.1s ease;
  border: 3px solid #000;
  color: #000;
  box-shadow: 3px 3px 0 #000;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.brutalistPink || '#ff6b9d'};
          
          &:hover {
            transform: translate(-2px, -2px);
            box-shadow: 5px 5px 0 #000;
          }
        `;
      case 'danger':
        return `
          background: #ff5f56;
          
          &:hover {
            transform: translate(-2px, -2px);
            box-shadow: 5px 5px 0 #000;
          }
        `;
      default:
        return `
          background: #fff;
            border-color: ${props.theme.colors.textSecondary};
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;

const SystemModal: React.FC = () => {
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => state.system.modal);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modal.isOpen) {
      setInputValue(modal.defaultValue || '');
      // Focus input after animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [modal.isOpen, modal.defaultValue]);

  const handleConfirm = () => {
    if (modal.callbackId) {
      const callback = modalCallbacks.get(modal.callbackId);
      if (callback) {
        if (modal.type === 'prompt') {
          callback(inputValue);
        } else {
          callback(true);
        }
        modalCallbacks.delete(modal.callbackId);
      }
    }
    dispatch(closeModal());
  };

  const handleCancel = () => {
    if (modal.callbackId) {
      const callback = modalCallbacks.get(modal.callbackId);
      if (callback) {
        callback(modal.type === 'prompt' ? null : false);
        modalCallbacks.delete(modal.callbackId);
      }
    }
    dispatch(closeModal());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!modal.isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCancel}
      >
        <ModalBox
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={e => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          <ModalHeader>
            {modal.type === 'confirm' ? <HelpCircle size={18} /> : <MessageSquare size={18} />}
            {modal.title}
          </ModalHeader>
          <ModalContent>
            <Message>{modal.message}</Message>
            {modal.type === 'prompt' && (
              <InputWrapper>
                {modal.placeholder && <Label>{modal.placeholder}</Label>}
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={modal.placeholder || 'Enter value...'}
                />
              </InputWrapper>
            )}
          </ModalContent>
          <ButtonGroup>
            <Button onClick={handleCancel}>
              {modal.cancelText}
            </Button>
            <Button 
              $variant={modal.type === 'confirm' && modal.confirmText?.toLowerCase().includes('delete') ? 'danger' : 'primary'}
              onClick={handleConfirm}
            >
              {modal.confirmText}
            </Button>
          </ButtonGroup>
        </ModalBox>
      </Overlay>
    </AnimatePresence>
  );
};

export default SystemModal;
