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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 100001;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled(motion.div)`
  width: 420px;
  background: ${props => props.theme.colors.windowBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  height: 44px;
  background: ${props => props.theme.colors.accent};
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: #fff;
`;

const ModalContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${props => props.theme.colors.text};
`;

const Message = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: ${props => props.theme.colors.background};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-family: 'Fira Code', monospace;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(225, 112, 85, 0.2);
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const ButtonGroup = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: ${props => props.theme.colors.background};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.accent};
          border: none;
          color: #fff;
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(225, 112, 85, 0.4);
          }
        `;
      case 'danger':
        return `
          background: #ff5f56;
          border: none;
          color: #fff;
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 95, 86, 0.4);
          }
        `;
      default:
        return `
          background: transparent;
          border: 1px solid ${props.theme.colors.border};
          color: ${props.theme.colors.text};
          
          &:hover {
            background: ${props.theme.colors.background};
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
