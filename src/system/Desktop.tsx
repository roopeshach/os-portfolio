import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import Taskbar from './Taskbar';
import WindowManager from './WindowManager';
import { readdir, fs, path as pathModule } from './FileSystem';
import { openProcess } from '../store/processSlice';
import { Folder, FileText, Globe, Terminal, Code, File } from 'lucide-react';

const DesktopContainer = styled.div<{ $wallpaper: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$wallpaper});
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
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
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  pointer-events: auto;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
  }
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
`;

const IconLabel = styled.div`
  font-size: 12px;
  text-align: center;
  margin-top: 5px;
  word-break: break-word;
  line-height: 1.2;
`;

const Desktop: React.FC = () => {
  const wallpaper = useSelector((state: RootState) => state.settings.wallpaper);
  const dispatch = useDispatch();
  const [items, setItems] = useState<string[]>([]);

  const loadDesktopItems = async () => {
    try {
      const desktopPath = '/Users/Roopesh/Desktop';
      const files = await readdir(desktopPath);
      setItems(files);
    } catch (e) {
      console.error('Failed to load desktop items', e);
    }
  };

  useEffect(() => {
    loadDesktopItems();
    // Poll for changes occasionally or setup a watcher (polling is simpler for now)
    const interval = setInterval(loadDesktopItems, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (filename: string) => {
    const fullPath = pathModule.join('/Users/Roopesh/Desktop', filename);
    
    fs.stat(fullPath, (err: any, stats: any) => {
      if (!err) {
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
              appId: 'Notepad',
              title: filename,
              icon: '/assets/icons/notepad.svg',
              componentName: 'Notepad',
              initialProps: { path: fullPath }
            }));
          } else {
             // Default fallback
             alert(`Cannot open ${filename}`);
          }
        }
      }
    });
  };

  const getIcon = (filename: string) => {
    if (filename.includes('.')) {
      if (filename.endsWith('.link')) return <Globe size={40} color="#0078d7" />;
      if (filename.endsWith('.txt')) return <FileText size={40} color="#fff" />;
      if (filename.endsWith('.js') || filename.endsWith('.ts')) return <Code size={40} color="#f0db4f" />;
      return <File size={40} color="#fff" />;
    }
    return <Folder size={40} color="#fcd12a" />;
  };

  return (
    <DesktopContainer $wallpaper={wallpaper}>
      <DesktopIcons>
        <IconWrapper onDoubleClick={() => dispatch(openProcess({ appId: 'Terminal', title: 'Terminal', icon: '/assets/icons/terminal.svg', componentName: 'Terminal' }))}>
          <Terminal size={40} color="#333" fill="#ccc" />
          <IconLabel>Terminal</IconLabel>
        </IconWrapper>
        
        <IconWrapper onDoubleClick={() => dispatch(openProcess({ appId: 'File Explorer', title: 'File Explorer', icon: '/assets/icons/folder.svg', componentName: 'File Explorer' }))}>
           <Folder size={40} color="#fcd12a" />
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
    </DesktopContainer>
  );
};

export default Desktop;
