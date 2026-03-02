import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';
import { useDispatch } from 'react-redux';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import { readdir, fs, path as pathModule } from './FileSystem';
import { openProcess } from '../store/processSlice';
import { Folder, Terminal, Globe, FileText, Code, File } from 'lucide-react';
import type { Stats, ErrnoException } from '../types/filesystem';
import SystemAlert from './components/SystemAlert';
import SystemModal from './components/SystemModal';
import { showAlert } from '../store/systemSlice';
import FireWallpaper from './components/FireWallpaper';

const DesktopContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.colors.background};
`;

const DesktopIcons = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;
  align-content: flex-start;
  gap: 15px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  pointer-events: none; /* Let clicks pass through if needed, but icons need events */
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const IconWrapper = styled.div`
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 14px;
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(4px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    background: radial-gradient(circle at center, ${props => props.theme.colors.accentGlow || 'rgba(206, 217, 121, 0.2)'} 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.theme.colors.glassBg || 'rgba(60, 35, 28, 0.5)'};
    border: 2px solid ${props => props.theme.colors.accent};
    box-shadow: 0 8px 32px ${props => props.theme.colors.shadow || 'rgba(0, 0, 0, 0.2)'},
                0 0 20px ${props => props.theme.colors.accentGlow || 'rgba(206, 217, 121, 0.15)'};
    animation: ${float} 2s ease-in-out infinite;
    
    &::before {
      opacity: 1;
    }
    
    svg {
      filter: drop-shadow(0 0 8px ${props => props.theme.colors.accent});
      transform: scale(1.1);
    }
  }
  
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  svg {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const IconLabel = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 8px;
  word-break: break-word;
  line-height: 1.3;
  text-shadow: 0 1px 4px ${props => props.theme.colors.shadow || 'rgba(0, 0, 0, 0.3)'};
  font-weight: 600;
`;

const slideIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(30px) scale(0.95);
    filter: blur(4px);
  }
  15% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  85% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  100% { 
    opacity: 0; 
    transform: translateY(-20px) scale(0.98);
    filter: blur(2px);
  }
`;

const underlineGrow = keyframes`
  0% { width: 0%; opacity: 0; }
  20% { width: 60%; opacity: 1; }
  80% { width: 60%; opacity: 1; }
  100% { width: 0%; opacity: 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const GreetingContainer = styled.div`
  position: absolute;
  bottom: 100px;
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
  font-size: 56px;
  font-weight: 900;
  margin: 0;
  letter-spacing: 8px;
  text-transform: uppercase;
  color: ${props => props.theme.colors.text};
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.accent} 0%, 
    #fff 25%,
    #CEB67E 50%, 
    #fff 75%,
    ${props => props.theme.colors.accent} 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${slideIn} 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  position: relative;
  text-shadow: none;
  filter: drop-shadow(0 0 30px ${props => props.theme.colors.accentGlow || 'rgba(206, 217, 121, 0.5)'});
  
  &::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    background: inherit;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: blur(20px);
    opacity: 0.5;
    animation: ${pulse} 3s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    height: 3px;
    background: linear-gradient(90deg, 
      transparent, 
      ${props => props.theme.colors.accent}, 
      #fff,
      ${props => props.theme.colors.accent}, 
      transparent);
    animation: ${underlineGrow} 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    border-radius: 2px;
    box-shadow: 0 0 20px ${props => props.theme.colors.accent};
  }
`;

const subtitleSlide = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(20px);
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
    transform: translateY(-15px);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const GreetingText = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.glassBg || 'rgba(60, 35, 28, 0.6)'};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 8px 32px ${props => props.theme.colors.shadow || 'rgba(0, 0, 0, 0.2)'},
              0 0 40px ${props => props.theme.colors.accentGlow || 'rgba(206, 217, 121, 0.1)'},
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 10px 28px;
  margin-top: 20px;
  border-radius: 25px;
  animation: ${subtitleSlide} 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: 0.15s;
  font-weight: 600;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.1) 50%, 
      transparent 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 3s linear infinite;
  }
`;

const Desktop: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [items, setItems] = useState<string[]>([]);
  const [greetingIndex, setGreetingIndex] = useState(0);
  
  const greetingData = [
    { name: "ROOPESH ACHARYA", text: "Software Engineer • Full Stack Developer" },
    { name: "< Developer />", text: "Building digital experiences with code" },
    { name: "ROOPESH ACHARYA", text: "React • TypeScript • Node.js • Python" },
    { name: "{ Creative }", text: "Where design meets functionality" },
    { name: "ROOPESH ACHARYA", text: "Open source enthusiast & lifelong learner" },
    { name: "[ Portfolio ]", text: "Explore projects, skills & more →" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex(prev => (prev + 1) % greetingData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

    fs.stat(fullPath, (err: ErrnoException | null, stats?: Stats) => {
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
            // @ts-ignore
            fs.readFile(fullPath, 'utf8', (err: any, data: string) => {
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
      if (filename.endsWith('.link')) return <Globe size={40} color={theme.colors.accent} />;
      if (filename.endsWith('.txt')) return <FileText size={40} color={theme.colors.text} />;
      if (filename.endsWith('.js') || filename.endsWith('.ts')) return <Code size={40} color={theme.colors.accent} />;
      return <File size={40} color={theme.colors.text} />;
    }
    return <Folder size={40} color={theme.colors.accent} />;
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
      <DesktopIcons>
        <IconWrapper onDoubleClick={() => dispatch(openProcess({ appId: 'Terminal', title: 'Terminal', icon: '/assets/icons/terminal.svg', componentName: 'Terminal' }))}>
          <Terminal size={40} color={theme.colors.accent} />
          <IconLabel>Terminal</IconLabel>
        </IconWrapper>
        
        <IconWrapper onDoubleClick={() => dispatch(openProcess({ appId: 'File Explorer', title: 'File Explorer', icon: '/assets/icons/folder.svg', componentName: 'File Explorer' }))}>
           <Folder size={40} color={theme.colors.accent} />
           <IconLabel>This PC</IconLabel>
        </IconWrapper>

        {items.map(item => (
          <IconWrapper 
            key={item} 
            onDoubleClick={() => handleOpen(item)}
            data-file-path={pathModule.join('/Users/Roopesh/Desktop', item)}
          >
            {getIcon(item)}
            <IconLabel>{item.replace('.link', '')}</IconLabel>
          </IconWrapper>
        ))}
      </DesktopIcons>
      <WindowManager />
      <Taskbar />
      <SystemAlert />
      <SystemModal />
    </DesktopContainer>
  );
};

export default Desktop;