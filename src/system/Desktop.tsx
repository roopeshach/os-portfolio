/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import { readdir, fs, path as pathModule } from './FileSystem';
import { openProcess } from '../store/processSlice';
import { Folder, Terminal, Globe, FileText, Code, File } from 'lucide-react';
import SystemAlert from './components/SystemAlert';
import SystemModal from './components/SystemModal';
import { showAlert } from '../store/systemSlice';
import FireWallpaper from './components/FireWallpaper';

interface IconPosition {
  x: number;
  y: number;
}

interface IconPositions {
  [key: string]: IconPosition;
}

const DesktopContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`;

const DesktopIconsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 56px; /* Leave space for taskbar */
  z-index: 10;
  pointer-events: none;
`;

const IconWrapper = styled.div<{ $x: number; $y: number; $isDragging?: boolean }>`
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
  padding: 12px;
  border: 3px solid #000;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  pointer-events: auto;
  box-shadow: ${props => props.$isDragging ? '8px 8px 0 #000' : '4px 4px 0 #000'};
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  z-index: ${props => props.$isDragging ? 1000 : 1};
  opacity: ${props => props.$isDragging ? 0.9 : 1};
  transform: ${props => props.$isDragging ? 'scale(1.05)' : 'scale(1)'};
  user-select: none;
  
  &:hover {
    background: ${props => props.theme.colors.brutalistOrange || '#ff9f43'};
  }
  
  color: #000;
  font-weight: 800;
  transition: ${props => props.$isDragging ? 'none' : 'box-shadow 0.1s ease, background 0.1s ease, transform 0.1s ease'};
  
  svg {
    color: #000;
  }
`;

const IconLabel = styled.div`
  font-size: 11px;
  text-align: center;
  margin-top: 8px;
  word-break: break-word;
  line-height: 1.3;
  font-weight: 800;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000;
`;

const slideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(20px);
  }
  15% { 
    opacity: 1; 
    transform: translateY(0);
  }
  85% { 
    opacity: 1; 
    transform: translateY(0);
  }
  100% { 
    opacity: 0; 
    transform: translateY(-10px);
  }
`;

const subtitleSlide = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(15px);
  }
  20% { 
    opacity: 1; 
    transform: translateY(0);
  }
  80% { 
    opacity: 1; 
    transform: translateY(0);
  }
  100% { 
    opacity: 0; 
    transform: translateY(-10px);
  }
`;

const GreetingContainer = styled.div`
  position: absolute;
  bottom: 120px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: none;
`;

const NameText = styled.h1`
  font-family: 'Rajdhani', sans-serif;
  font-size: 64px;
  font-weight: 900;
  margin: 0;
  letter-spacing: 10px;
  text-transform: uppercase;
  color: #000;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  padding: 10px 40px;
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;
  animation: ${slideIn} 5s ease-in-out infinite;
  position: relative;
`;

const GreetingText = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #000;
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  padding: 12px 30px;
  margin-top: 20px;
  animation: ${subtitleSlide} 5s ease-in-out infinite;
  animation-delay: 0.15s;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Desktop: React.FC = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState<string[]>([]);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [iconPositions, setIconPositions] = useState<IconPositions>(() => {
    try {
      const saved = localStorage.getItem('desktopIconPositions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const greetingData = [
    { name: "ROOPESH ACHARYA", text: "Software Engineer • Full Stack Developer" },
    { name: "< Developer />", text: "Building digital experiences with code" },
    { name: "ROOPESH ACHARYA", text: "React • TypeScript • Node.js • Python" },
    { name: "{ Creative }", text: "Where design meets functionality" },
    { name: "ROOPESH ACHARYA", text: "Open source enthusiast & lifelong learner" },
    { name: "[ Portfolio ]", text: "Explore projects, skills & more →" },
  ];

  // Initialize icon positions
  const getDefaultPosition = useCallback((index: number): IconPosition => {
    const iconsPerColumn = Math.floor((window.innerHeight - 100) / 130);
    const col = Math.floor(index / iconsPerColumn);
    const row = index % iconsPerColumn;
    return { x: 15 + col * 110, y: 15 + row * 130 };
  }, []);

  // Save positions to localStorage
  useEffect(() => {
    if (Object.keys(iconPositions).length > 0) {
      localStorage.setItem('desktopIconPositions', JSON.stringify(iconPositions));
    }
  }, [iconPositions]);

  const handleMouseDown = (e: React.MouseEvent, iconId: string) => {
    if (e.button !== 0) return; // Only left click
    const rect = (e.target as HTMLElement).closest('[data-icon]')?.getBoundingClientRect();
    if (!rect) return;
    
    setDraggingIcon(iconId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingIcon || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - containerRect.left - dragOffset.x;
    const newY = e.clientY - containerRect.top - dragOffset.y;
    
    // Clamp to container bounds
    const clampedX = Math.max(0, Math.min(newX, containerRect.width - 100));
    const clampedY = Math.max(0, Math.min(newY, containerRect.height - 130));
    
    setIconPositions(prev => ({
      ...prev,
      [draggingIcon]: { x: clampedX, y: clampedY }
    }));
  }, [draggingIcon, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggingIcon(null);
  }, []);

  useEffect(() => {
    if (draggingIcon) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingIcon, handleMouseMove, handleMouseUp]);

  const getIconPosition = (iconId: string, index: number): IconPosition => {
    return iconPositions[iconId] || getDefaultPosition(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex(prev => (prev + 1) % greetingData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [greetingData.length]);

  const loadDesktopItems = useCallback(async () => {
    try {
      const desktopPath = '/Users/Roopesh/Desktop';
      const files = await readdir(desktopPath);
      setItems(files);
    } catch (e) {
      console.error('Failed to load desktop items', e);
    }
  }, []);

  useEffect(() => {
    // Poll for changes occasionally or setup a watcher (polling is simpler for now)
    const load = () => {
        loadDesktopItems();
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [loadDesktopItems]);

  const handleOpen = (filename: string) => {
    const fullPath = pathModule.join('/Users/Roopesh/Desktop', filename);
    
    // Check for Projects folder shortcut
    if (filename === 'Projects') {
      dispatch(openProcess({
        appId: 'Project Navigator',
        title: 'Project Navigator',
        icon: '/assets/icons/folder.svg',
        componentName: 'Project Navigator',
      }));
      return;
    }

    (fs as any).stat(fullPath, (err: any, stats: any) => {
      if (!err && stats) {
        if (stats.isDirectory()) {
          dispatch(openProcess({
            appId: 'File Explorer',
            title: filename,
            icon: '/assets/icons/folder.svg',
            componentName: 'File Explorer',
            initialProps: { path: fullPath }
          }));
        } else {
          const ext = pathModule.extname(filename);
          if (filename.endsWith('.link')) {
            // Read link content
            (fs as any).readFile(fullPath, 'utf8', (err: any, data: string) => {
               if (!err && data.trim().startsWith('http')) {
                 dispatch(openProcess({
                   appId: 'Browser',
                   title: filename.replace('.link', ''),
                   icon: '/assets/icons/edge.svg',
                   componentName: 'Browser',
                   initialProps: { initialUrl: data.trim() }
                 }));
               }
            });
          } else if (filename.endsWith('.project')) {
            dispatch(openProcess({
              appId: 'Project Viewer',
              title: filename.replace('.project', ''),
              icon: '/assets/icons/folder.svg',
              componentName: 'Project Viewer',
              initialProps: { path: fullPath }
            }));
          } else if (['.txt', '.md', '.json', '.ts', '.js'].includes(ext)) {
            dispatch(openProcess({
              appId: 'VS Code',
              title: filename,
              icon: '/assets/icons/vscode.svg',
              componentName: 'VS Code',
              initialProps: { path: fullPath }
            }));
          } else {
             // Default fallback
             dispatch(showAlert({
               title: 'System Error',
               message: `Cannot open ${filename}. No application associated with this file type.`,
               type: 'error'
             }));
          }
        }
      }
    });
  };

  const getIcon = (filename: string) => {
    if (filename.includes('.')) {
      if (filename.endsWith('.link')) return <Globe size={40} color="#000" />;
      if (filename.endsWith('.txt')) return <FileText size={40} color="#000" />;
      if (filename.endsWith('.js') || filename.endsWith('.ts')) return <Code size={40} color="#000" />;
      return <File size={40} color="#000" />;
    }
    return <Folder size={40} color="#000" />;
  };

  return (
    <DesktopContainer>
      <FireWallpaper />
      <GreetingContainer>
        <NameText key={`name-${greetingIndex}`}>
            {greetingData[greetingIndex].name}
        </NameText>
        <GreetingText key={`greeting-${greetingIndex}`}>
           {greetingData[greetingIndex].text}
        </GreetingText>
      </GreetingContainer>
      <DesktopIconsContainer ref={containerRef}>
        <IconWrapper 
          $x={getIconPosition('terminal', 0).x}
          $y={getIconPosition('terminal', 0).y}
          $isDragging={draggingIcon === 'terminal'}
          data-icon="terminal"
          onMouseDown={(e) => handleMouseDown(e, 'terminal')}
          onDoubleClick={() => !draggingIcon && dispatch(openProcess({ appId: 'Terminal', title: 'Terminal', icon: '/assets/icons/terminal.svg', componentName: 'Terminal' }))}
        >
          <Terminal size={40} color="#000" />
          <IconLabel>Terminal</IconLabel>
        </IconWrapper>
        
        <IconWrapper 
          $x={getIconPosition('fileexplorer', 1).x}
          $y={getIconPosition('fileexplorer', 1).y}
          $isDragging={draggingIcon === 'fileexplorer'}
          data-icon="fileexplorer"
          onMouseDown={(e) => handleMouseDown(e, 'fileexplorer')}
          onDoubleClick={() => !draggingIcon && dispatch(openProcess({ appId: 'File Explorer', title: 'File Explorer', icon: '/assets/icons/folder.svg', componentName: 'File Explorer' }))}
        >
           <Folder size={40} color="#000" />
           <IconLabel>This PC</IconLabel>
        </IconWrapper>

        {items.map((item, index) => (
          <IconWrapper 
            key={item}
            $x={getIconPosition(item, index + 2).x}
            $y={getIconPosition(item, index + 2).y}
            $isDragging={draggingIcon === item}
            data-icon={item}
            data-file-path={pathModule.join('/Users/Roopesh/Desktop', item)}
            onMouseDown={(e) => handleMouseDown(e, item)}
            onDoubleClick={() => !draggingIcon && handleOpen(item)}
          >
            {getIcon(item)}
            <IconLabel>{item.replace('.link', '')}</IconLabel>
          </IconWrapper>
        ))}
      </DesktopIconsContainer>
      <WindowManager />
      <Taskbar />
      <SystemAlert />
      <SystemModal />
    </DesktopContainer>
  );
};

export default Desktop;