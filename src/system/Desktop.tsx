import React, { useState, useEffect, useCallback } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useDispatch } from 'react-redux';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import { readdir, fs, path as pathModule } from './FileSystem';
import { openProcess } from '../store/processSlice';
import { Folder, Terminal, Globe, FileText, Code, File } from 'lucide-react';
import type { Stats, ErrnoException } from '../types/filesystem';
import SystemAlert from './components/SystemAlert';
import { showAlert } from '../store/systemSlice';
import FireWallpaper from './components/FireWallpaper';

const DesktopContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #000;
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

const IconWrapper = styled.div`
  width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border: 2px solid transparent;
  pointer-events: auto;
  
  &:hover {
    background: ${props => props.theme.colors.accent};
    border: 2px solid #000;
    box-shadow: 4px 4px 0px #000;
    color: #fff;
  }
  
  color: ${props => props.theme.colors.text};
  font-weight: bold;
  transition: all 0.1s;
`;

const IconLabel = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 5px;
  word-break: break-word;
  line-height: 1.2;
`;

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(10px); }
`;

const GreetingContainer = styled.div`
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: none;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
`;

const NameText = styled.h1`
  font-family: 'Rajdhani', sans-serif;
  font-size: 72px;
  font-weight: 900;
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${props => props.theme.colors.accent};
  /* Hard shadow for brutalism */
  text-shadow: 4px 4px 0px #000;
  animation: ${fadeInOut} 4s infinite;
  -webkit-text-stroke: 1px #000;
`;

const GreetingText = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 24px;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.background};
  border: 2px solid #000;
  box-shadow: 4px 4px 0px #000;
  padding: 5px 15px;
  margin-top: 10px;
  min-height: 30px;
  animation: ${() => css`${fadeInOut} 4s infinite`};
  font-weight: 700;
`;

const Desktop: React.FC = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState<string[]>([]);
  const [greetingIndex, setGreetingIndex] = useState(0);
  
  const greetingData = [
    { name: "ROOPESH ACHARYA", text: "Welcome to my digital space" },
    { name: "रुपेश आचार्य", text: "मेरो डिजिटल संसारमा स्वागत छ" },
    { name: "ROOPESH ACHARYA", text: "Explore my projects & skills" },
    { name: "रुपेश आचार्य", text: "मेरा प्रोजेक्ट र सीपहरु हेर्नुहोस्" },
    { name: "ROOPESH ACHARYA", text: "Built with React & TypeScript" },
    { name: "रुपेश आचार्य", text: "रियाक्ट र टाइपस्क्रिप्टमा निर्मित" },
    { name: "ROOPESH ACHARYA", text: "Enjoy the experience" },
    { name: "रुपेश आचार्य", text: "अनुभवको आनन्द लिनुहोस्" }
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
      if (filename.endsWith('.link')) return <Globe size={40} color="#D2691E" />;
      if (filename.endsWith('.txt')) return <FileText size={40} color="#fff" />;
      if (filename.endsWith('.js') || filename.endsWith('.ts')) return <Code size={40} color="#D2691E" />;
      return <File size={40} color="#fff" />;
    }
    return <Folder size={40} color="#D2691E" />;
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
          <Terminal size={40} color="#333" fill="#ccc" />
          <IconLabel>Terminal</IconLabel>
        </IconWrapper>
        
        <IconWrapper onDoubleClick={() => dispatch(openProcess({ appId: 'File Explorer', title: 'File Explorer', icon: '/assets/icons/folder.svg', componentName: 'File Explorer' }))}>
           <Folder size={40} color="#D2691E" />
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
    </DesktopContainer>
  );
};

export default Desktop;