import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { ResizableBox, type ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import { closeProcess, minimizeProcess, maximizeProcess, focusProcess } from '../store/processSlice';
import type { RootState } from '../store';
import { X, Minus, Square, Copy } from 'lucide-react';

const WindowContainer = styled.div<{ $active: boolean; $minimized: boolean; $maximized: boolean; $zIndex: number }>`
  position: absolute;
  /* Default position handled by Draggable */
  /* width and height handled by ResizableBox */
  background: ${props => props.theme.colors.windowBackground};
  /* Neo-Brutalism: No blur, thick borders, hard shadows */
  border: 3px solid #000000;
  box-shadow: ${props => props.$active ? '8px 8px 0px #000000' : '4px 4px 0px #000000'};
  display: ${props => props.$minimized ? 'none' : 'flex'};
  flex-direction: column;
  z-index: ${props => props.$zIndex};
  border-radius: 0; /* Sharp corners */
  overflow: hidden;
  
  /* Fix for maximize overriding draggable transform */
  ${props => props.$maximized && `
    transform: translate(0, 0) !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: calc(100vh - 48px) !important; /* Adjusted for taskbar height */
    border: none;
    border-bottom: 3px solid #000;
  `}
  
  /* Only transition opacity, width/height transition conflicts with resize */
  transition: opacity 0.2s;
`;

const TitleBar = styled.div<{ $active: boolean }>`
  height: 36px;
  background: ${props => props.$active ? props.theme.colors.accent : props.theme.colors.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  user-select: none;
  border-bottom: 3px solid #000000;
  flex-shrink: 0;
  cursor: grab;
  color: ${props => props.$active ? '#fff' : props.theme.colors.text};
  
  &:active {
    cursor: grabbing;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  flex-grow: 1;
  color: ${props => props.theme.colors.text};
  text-transform: uppercase;
`;

const Controls = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.div<{ type?: 'close' }>`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 2px solid #000;
  background: #fff;
  color: #000;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.1s;
  
  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #000;
    background: ${props => props.type === 'close' ? '#ff4d4d' : '#F3F4EF'};
  }
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0px #000;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: hidden; /* Important for terminal to fit correctly */
  position: relative;
  display: flex;
  flex-direction: column;
`;

// Add custom resize handle style
const ResizeHandleDiv = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  bottom: 0;
  right: 0;
  cursor: se-resize;
  z-index: 10;
  &::after {
    content: '';
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 6px;
    height: 6px;
    border-right: 2px solid ${props => props.theme.colors.textSecondary};
    border-bottom: 2px solid ${props => props.theme.colors.textSecondary};
  }
`;

// Wrapper to filter out props passed by ResizableBox
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResizeHandle = React.forwardRef((props: any, ref: any) => {
  // Explicitly extract handleAxis to prevent it from being passed to the DOM
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleAxis, ...rest } = props;
  return <ResizeHandleDiv ref={ref} {...rest} />;
});

interface WindowFrameProps {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
}

const WindowFrame: React.FC<WindowFrameProps> = ({ id, title, icon, children }) => {
  const dispatch = useDispatch();
  const process = useSelector((state: RootState) => state.process.processes[id]);
  const activeId = useSelector((state: RootState) => state.process.activeId);
  const stack = useSelector((state: RootState) => state.process.stack);
  const nodeRef = useRef(null);
  
  // Local state for size
  const [size, setSize] = useState({ width: 600, height: 400 });

  const isActive = activeId === id;
  const zIndex = stack.indexOf(id) + 100; // 1-based index + base z-index to be above desktop items

  const handleMouseDown = () => {
    dispatch(focusProcess(id));
  };

  const onResize = (_event: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    setSize({ width: size.width, height: size.height });
  };

  if (!process) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".title-bar"
      disabled={process.maximized}
      onMouseDown={handleMouseDown}
      defaultPosition={{
        x: Math.max(0, (window.innerWidth - size.width) / 2 + (stack.indexOf(id) * 20)),
        y: Math.max(0, (window.innerHeight - size.height) / 2 + (stack.indexOf(id) * 20))
      }}
    >
      <WindowContainer 
        ref={nodeRef}
        $active={isActive} 
        $minimized={process.minimized} 
        $maximized={process.maximized}
        $zIndex={zIndex}
        onClick={handleMouseDown}
        style={!process.maximized ? { width: size.width, height: size.height } : undefined}
      >
        <ResizableBox 
          width={process.maximized ? window.innerWidth : size.width} 
          height={process.maximized ? window.innerHeight - 48 : size.height} 
          onResize={onResize}
          resizeHandles={process.maximized ? [] : ['se']}
          minConstraints={[300, 200]}
          maxConstraints={[window.innerWidth, window.innerHeight]}
          handle={!process.maximized ? <ResizeHandle /> : <span />}
          className="custom-resizable"
        >
           <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TitleBar className="title-bar" $active={isActive}>
              <Title>
                 <img src={icon} alt="" style={{width: 16, height: 16, display: icon ? 'block' : 'none'}} onError={(e) => e.currentTarget.style.display = 'none'}/> 
                 {title}
              </Title>
              <Controls>
                <ControlButton onClick={(e) => { e.stopPropagation(); dispatch(minimizeProcess(id)); }}>
                  <Minus size={14} />
                </ControlButton>
                <ControlButton onClick={(e) => { e.stopPropagation(); dispatch(maximizeProcess(id)); }}>
                  {process.maximized ? <Copy size={12} /> : <Square size={12} />}
                </ControlButton>
                <ControlButton type="close" onClick={(e) => { e.stopPropagation(); dispatch(closeProcess(id)); }}>
                  <X size={14} />
                </ControlButton>
              </Controls>
            </TitleBar>
            <Content>
              {children}
            </Content>
          </div>
        </ResizableBox>
      </WindowContainer>
    </Draggable>
  );
};

export default WindowFrame;
