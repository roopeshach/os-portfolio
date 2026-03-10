/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { readdir, fs, path as pathModule, mkdir, writeFile, readFile } from '../system/FileSystem';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { showAlert } from '../store/systemSlice';
import { useSystemModal } from '../hooks/useSystemModal';
import { 
  Folder, FileText, ArrowLeft, FilePlus, FolderPlus, Copy, Scissors, Clipboard, Trash2
} from 'lucide-react';

interface IconPosition {
  x: number;
  y: number;
}

interface IconPositions {
  [key: string]: IconPosition;
}

interface ClipboardItem {
  name: string;
  fullPath: string;
  cut: boolean;
}

const ExplorerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  color: #000;
`;

const Toolbar = styled.div`
  padding: 8px;
  border-bottom: 3px solid #000;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
`;

const AddressBar = styled.input`
  flex: 1;
  padding: 6px 10px;
  background: #fff;
  border: 3px solid #000;
  color: #000;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
`;

const IconButton = styled.button`
  background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
  border: 3px solid #000;
  color: #000;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 800;
  font-family: 'Rajdhani', sans-serif;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.1s ease;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 #000;
  }
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #000;
  }
  
  svg {
    color: #000;
  }
`;

const FileList = styled.div<{ $useGrid?: boolean }>`
  flex: 1;
  position: relative;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  display: ${props => props.$useGrid ? 'flex' : 'block'};
  flex-wrap: ${props => props.$useGrid ? 'wrap' : 'nowrap'};
  gap: ${props => props.$useGrid ? '12px' : '0'};
  align-content: ${props => props.$useGrid ? 'flex-start' : 'normal'};
`;

const FileItem = styled.div<{ $x?: number; $y?: number; $isDragging?: boolean; $isGrid?: boolean; $selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
  padding: 10px;
  border: 3px solid #000;
  background: ${props => props.$selected ? (props.theme.colors.brutalistPink || '#ff6b9d') : (props.theme.colors.brutalistGreen || '#6bcb77')};
  box-shadow: ${props => props.$isDragging ? '6px 6px 0 #000' : '3px 3px 0 #000'};
  width: 90px;
  height: max-content;
  transition: ${props => props.$isDragging ? 'none' : 'box-shadow 0.1s ease, background 0.1s ease, transform 0.1s ease'};
  user-select: none;
  position: ${props => props.$isGrid ? 'relative' : 'absolute'};
  left: ${props => props.$isGrid ? 'auto' : `${props.$x}px`};
  top: ${props => props.$isGrid ? 'auto' : `${props.$y}px`};
  z-index: ${props => props.$isDragging ? 1000 : 1};
  opacity: ${props => props.$isDragging ? 0.9 : 1};
  transform: ${props => props.$isDragging ? 'scale(1.05)' : 'scale(1)'};
  
  &:hover {
    background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  }
  
  svg {
    color: #000;
  }
`;

const FileName = styled.div`
  font-size: 11px;
  text-align: center;
  word-break: break-word;
  margin-top: 8px;
  font-weight: 700;
  color: #000;
  font-family: 'Rajdhani', sans-serif;
  text-transform: uppercase;
`;

const FileExplorer: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/Users/Roopesh');
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [clipboardItem, setClipboardItem] = useState<ClipboardItem | null>(null);
  const [iconPositions, setIconPositions] = useState<IconPositions>({});
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const modal = useSystemModal();

  // Get storage key for current path
  const getStorageKey = useCallback(() => `fileExplorerPositions_${currentPath}`, [currentPath]);

  // Initialize icon positions
  const getDefaultPosition = useCallback((index: number): IconPosition => {
    const containerWidth = Math.max(600, window.innerWidth - 240);
    const iconsPerRow = Math.floor(containerWidth / 110);
    const col = index % iconsPerRow;
    const row = Math.floor(index / iconsPerRow);
    return { x: 15 + col * 110, y: 15 + row * 130 };
  }, []);

  // Load saved positions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIconPositions(JSON.parse(saved));
      } catch {
        setIconPositions({});
      }
    } else {
      setIconPositions({});
    }
  }, [getStorageKey]);

  // Save positions to localStorage
  useEffect(() => {
    if (Object.keys(iconPositions).length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(iconPositions));
    }
  }, [iconPositions, getStorageKey]);

  const handleMouseDown = (e: React.MouseEvent, iconId: string) => {
    if (e.button !== 0) return;
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

  const hasCustomPositions = Object.keys(iconPositions).length > 0;

  useEffect(() => {
    const loadFiles = async (path: string) => {
      try {
        const fileList = await readdir(path);
        setFiles(fileList);
      } catch (e) {
        console.error(e);
        setFiles([]);
      }
    };
    loadFiles(currentPath);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedFile(null);
  }, [currentPath]);

  const refreshCurrentPath = useCallback(async () => {
    try {
      const fileList = await readdir(currentPath);
      setFiles(fileList);
    } catch (e) {
      console.error(e);
      setFiles([]);
    }
  }, [currentPath]);

  const getUniqueTargetPath = useCallback(async (basePath: string) => {
    const ext = pathModule.extname(basePath);
    const nameNoExt = pathModule.basename(basePath, ext);
    const dir = pathModule.dirname(basePath);

    let counter = 1;
    let candidate = basePath;

    const existsPath = (p: string) => new Promise<boolean>((resolve) => {
      (fs as any).stat(p, (err: any) => resolve(!err));
    });

    while (await existsPath(candidate)) {
      candidate = pathModule.join(dir, `${nameNoExt} copy${counter > 1 ? ` ${counter}` : ''}${ext}`);
      counter += 1;
    }

    return candidate;
  }, []);

  async function copyEntryRecursive(srcPath: string, destPath: string): Promise<void> {
    const stat = await new Promise<any>((resolve, reject) => {
      (fs as any).stat(srcPath, (err: any, s: any) => err ? reject(err) : resolve(s));
    });

    if (stat?.isDirectory()) {
      await mkdir(destPath);
      const children = await readdir(srcPath);
      for (const child of children) {
        await copyEntryRecursive(pathModule.join(srcPath, child), pathModule.join(destPath, child));
      }
      return;
    }

    const data = await readFile(srcPath);
    await writeFile(destPath, data);
  }

  async function deleteEntryRecursive(targetPath: string): Promise<void> {
    const stat = await new Promise<any>((resolve, reject) => {
      (fs as any).stat(targetPath, (err: any, s: any) => err ? reject(err) : resolve(s));
    });

    if (stat?.isDirectory()) {
      const children = await readdir(targetPath);
      for (const child of children) {
        await deleteEntryRecursive(pathModule.join(targetPath, child));
      }
      await new Promise<void>((resolve, reject) => {
        (fs as any).rmdir(targetPath, (err: any) => err ? reject(err) : resolve());
      });
      return;
    }

    await new Promise<void>((resolve, reject) => {
      (fs as any).unlink(targetPath, (err: any) => err ? reject(err) : resolve());
    });
  }

  const copySelected = useCallback(() => {
    if (!selectedFile) return;
    setClipboardItem({
      name: selectedFile,
      fullPath: pathModule.join(currentPath, selectedFile),
      cut: false,
    });
  }, [selectedFile, currentPath]);

  const cutSelected = useCallback(() => {
    if (!selectedFile) return;
    setClipboardItem({
      name: selectedFile,
      fullPath: pathModule.join(currentPath, selectedFile),
      cut: true,
    });
  }, [selectedFile, currentPath]);

  async function pasteClipboard(): Promise<void> {
    if (!clipboardItem) return;
    try {
      const targetBase = pathModule.join(currentPath, clipboardItem.name);
      const targetPath = await getUniqueTargetPath(targetBase);

      if (clipboardItem.cut) {
        await new Promise<void>((resolve, reject) => {
          (fs as any).rename(clipboardItem.fullPath, targetPath, (err: any) => err ? reject(err) : resolve());
        });
        setClipboardItem(null);
      } else {
        await copyEntryRecursive(clipboardItem.fullPath, targetPath);
      }

      await refreshCurrentPath();
    } catch {
      dispatch(showAlert({
        title: 'Paste Error',
        message: 'Unable to paste selected item.',
        type: 'error',
      }));
    }
  }

  async function deleteSelected(): Promise<void> {
    if (!selectedFile) return;
    const confirmed = await modal.confirm({
      title: 'Delete',
      message: `Delete ${selectedFile}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
    if (!confirmed) return;

    try {
      await deleteEntryRecursive(pathModule.join(currentPath, selectedFile));
      setSelectedFile(null);
      await refreshCurrentPath();
    } catch {
      dispatch(showAlert({
        title: 'Delete Error',
        message: 'Unable to delete selected item.',
        type: 'error',
      }));
    }
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;

      const isMod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (isMod && key === 'c') {
        e.preventDefault();
        copySelected();
      }
      if (isMod && key === 'x') {
        e.preventDefault();
        cutSelected();
      }
      if (isMod && key === 'v') {
        e.preventDefault();
        void pasteClipboard();
      }
      if (key === 'delete' || key === 'backspace') {
        if (selectedFile) {
          e.preventDefault();
          void deleteSelected();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleNavigate = (newPath: string) => {
    setCurrentPath(newPath);
  };

  const handleUp = () => {
    const parent = pathModule.dirname(currentPath);
    handleNavigate(parent);
  };

  function openFile(filename: string): void {
    const fullPath = pathModule.join(currentPath, filename);
    
    fs.stat(fullPath, (err: unknown, stats: any) => {
      if (!err && stats) {
        if (stats.isDirectory()) {
          handleNavigate(fullPath);
        } else {
          // Determine app to open based on extension
          const ext = pathModule.extname(filename);
          if (filename.endsWith('.project')) {
            dispatch(openProcess({
              appId: 'Project Viewer',
              title: filename.replace('.project', ''),
              icon: 'assets/icons/folder.svg',
              componentName: 'Project Viewer',
              initialProps: { path: fullPath }
            }));
          } else if (['.txt', '.md', '.js', '.ts', '.json', '.css', '.html'].includes(ext)) {
             dispatch(openProcess({
               appId: 'Notepad',
               title: filename,
               icon: 'assets/icons/notepad.svg',
               componentName: 'Notepad',
               initialProps: { path: fullPath }
             }));
          } else {
             dispatch(showAlert({
               title: 'Application Error',
               message: 'No app associated with this file type.',
               type: 'warning'
             }));
          }
        }
      }
    });
  }

  const createNewFile = async () => {
    const name = await modal.prompt({
      title: 'New File',
      message: 'Enter a name for the new file:',
      placeholder: 'File name',
      defaultValue: 'untitled.txt',
      confirmText: 'Create',
    });
    if (!name) return;
    const targetPath = pathModule.join(currentPath, name);
    try {
      await writeFile(targetPath, '');
      await refreshCurrentPath();
    } catch (e) {
      console.error(e);
    }
  };

  const createNewFolder = async () => {
    const name = await modal.prompt({
      title: 'New Folder',
      message: 'Enter a name for the new folder:',
      placeholder: 'Folder name',
      defaultValue: 'New Folder',
      confirmText: 'Create',
    });
    if (!name) return;
    const targetPath = pathModule.join(currentPath, name);
    try {
      await mkdir(targetPath);
      await refreshCurrentPath();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ExplorerContainer>
      <Toolbar>
        <IconButton onClick={handleUp} title="Back"><ArrowLeft size={16}/></IconButton>
        <AddressBar value={currentPath} readOnly />
        <IconButton onClick={copySelected} title="Copy"><Copy size={16}/></IconButton>
        <IconButton onClick={cutSelected} title="Cut"><Scissors size={16}/></IconButton>
        <IconButton onClick={() => void pasteClipboard()} title="Paste"><Clipboard size={16}/></IconButton>
        <IconButton onClick={() => void deleteSelected()} title="Delete"><Trash2 size={16}/></IconButton>
        <IconButton onClick={createNewFile} title="New File"><FilePlus size={16}/></IconButton>
        <IconButton onClick={createNewFolder} title="New Folder"><FolderPlus size={16}/></IconButton>
      </Toolbar>
      <FileList ref={containerRef} data-folder-path={currentPath} $useGrid={!hasCustomPositions && !draggingIcon}>
        {files.map((file, index) => {
          const pos = getIconPosition(file, index);
          const useGridLayout = !hasCustomPositions && !draggingIcon;
          return (
            <FileItem 
              key={file}
              $x={pos.x}
              $y={pos.y}
              $isDragging={draggingIcon === file}
              $isGrid={useGridLayout}
              $selected={selectedFile === file}
              data-icon={file}
              data-file-path={pathModule.join(currentPath, file)}
              onMouseDown={(e) => {
                setSelectedFile(file);
                handleMouseDown(e, file);
              }}
              onDoubleClick={() => !draggingIcon && openFile(file)}
            >
               {/* Simple heuristic for icon */}
              {file.endsWith('.project') ? (
                <Folder size={32} color="#000" /> 
              ) : !file.includes('.') ? (
                <Folder size={32} color="#000" /> 
              ) : (
                <FileText size={32} color="#000" />
              )}
              <FileName>{file}</FileName>
            </FileItem>
          );
        })}
      </FileList>
    </ExplorerContainer>
  );
};

export default FileExplorer;
