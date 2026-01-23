import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { mkdir, writeFile, unlink, path as pathModule } from './FileSystem';
import { FolderPlus, FilePlus, Code, Trash2 } from 'lucide-react';

const Menu = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  top: ${props => props.$y}px;
  left: ${props => props.$x}px;
  background: rgba(10, 15, 30, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  padding: 4px;
  min-width: 200px;
  z-index: 99999;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MenuItem = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 13px;
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: ${props => props.theme.colors.accent};
    color: white;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 2px 0;
`;

interface ContextMenuProps {
  targetPath?: string; // Path where actions should happen (Desktop or Folder)
  targetFile?: string; // Specific file clicked
}

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [context, setContext] = useState<ContextMenuProps>({});
  const dispatch = useDispatch();

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      
      // Determine context based on what was clicked
      // We can use data attributes on elements to hint context
      const target = e.target as HTMLElement;
      const fileTarget = target.closest('[data-file-path]');
      const folderTarget = target.closest('[data-folder-path]');
      
      // Default to desktop if nothing specific
      let path = '/Users/Roopesh/Desktop';
      let file = undefined;

      if (fileTarget) {
        file = fileTarget.getAttribute('data-file-path') || undefined;
        path = pathModule.dirname(file || '');
      } else if (folderTarget) {
        path = folderTarget.getAttribute('data-folder-path') || path;
      }

      setContext({ targetPath: path, targetFile: file });
      setCoords({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const handleClick = () => {
      if (visible) setVisible(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, [visible]);

  const handleNewFolder = async () => {
    if (!context.targetPath) return;
    const name = prompt('Folder Name:', 'New Folder');
    if (name) {
      await mkdir(pathModule.join(context.targetPath, name));
    }
    setVisible(false);
  };

  const handleNewFile = async () => {
    if (!context.targetPath) return;
    const name = prompt('File Name:', 'New Text Document.txt');
    if (name) {
      await writeFile(pathModule.join(context.targetPath, name), '');
    }
    setVisible(false);
  };

  const handleOpenVSCode = () => {
    if (context.targetFile) {
      dispatch(openProcess({
        appId: 'VS Code',
        title: pathModule.basename(context.targetFile),
        icon: '/assets/icons/vscode.svg',
        componentName: 'VS Code',
        initialProps: { path: context.targetFile } // Assuming CodeEditor accepts path
      }));
    } else if (context.targetPath) {
       dispatch(openProcess({
        appId: 'VS Code',
        title: 'VS Code',
        icon: '/assets/icons/vscode.svg',
        componentName: 'VS Code',
        initialProps: { path: context.targetPath }
      }));
    }
    setVisible(false);
  };

  const handleDelete = async () => {
    if (context.targetFile) {
      if (confirm(`Are you sure you want to delete ${pathModule.basename(context.targetFile)}?`)) {
        try {
          await unlink(context.targetFile);
        } catch (e) {
          console.error(e);
          alert('Failed to delete file');
        }
      }
    }
    setVisible(false);
  };

  return (
    <>
      {children}
      {visible && (
        <Menu $x={coords.x} $y={coords.y} onClick={(e) => e.stopPropagation()}>
          <MenuItem onClick={handleNewFolder}>
            <FolderPlus size={16} />
            <span>New Folder</span>
          </MenuItem>
          <MenuItem onClick={handleNewFile}>
            <FilePlus size={16} />
            <span>New File</span>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleOpenVSCode}>
            <Code size={16} />
            <span>Open with VS Code</span>
          </MenuItem>
          {context.targetFile && (
            <>
              <Divider />
              <MenuItem onClick={handleDelete} style={{ color: '#ff4d4d' }}>
                <Trash2 size={16} />
                <span>Delete</span>
              </MenuItem>
            </>
          )}
        </Menu>
      )}
    </>
  );
};
