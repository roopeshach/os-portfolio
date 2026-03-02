import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { readdir, fs, path as pathModule, mkdir, writeFile } from '../system/FileSystem';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { showAlert } from '../store/systemSlice';
import { useSystemModal } from '../hooks/useSystemModal';
import { 
  Folder, FileText, ArrowLeft, FilePlus, FolderPlus
} from 'lucide-react';

const ExplorerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Toolbar = styled.div`
  padding: 5px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddressBar = styled.input`
  flex: 1;
  padding: 4px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const IconButton = styled.button`
  background: ${props => props.theme.colors.windowBackground};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  border-radius: 6px;
  transition: all 0.15s ease;
  
  &:hover {
    background: ${props => props.theme.colors.accent};
    border-color: ${props => props.theme.colors.accent};
    color: #fff;
  }
  &:active {
    transform: scale(0.95);
  }
`;

const FileList = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  grid-auto-rows: min-content; /* Ensure rows don't stretch */
  gap: 10px;
  padding: 10px;
  overflow-y: auto;
  align-content: start; /* Pack items at the start */
`;

const FileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  height: max-content; /* Fix height issue */
  &:hover {
    background: ${props => props.theme.colors.hover};
  }
`;

const FileName = styled.div`
  font-size: 12px;
  text-align: center;
  word-break: break-word;
  margin-top: 5px;
`;

const FileExplorer: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/Users/Roopesh');
  const [files, setFiles] = useState<string[]>([]);
  const dispatch = useDispatch();
  const modal = useSystemModal();

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
  }, [currentPath]);

  const handleNavigate = (newPath: string) => {
    setCurrentPath(newPath);
  };

  const handleUp = () => {
    const parent = pathModule.dirname(currentPath);
    handleNavigate(parent);
  };

  const openFile = (filename: string) => {
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
              icon: '/assets/icons/folder.svg',
              componentName: 'Project Viewer',
              initialProps: { path: fullPath }
            }));
          } else if (['.txt', '.md', '.js', '.ts', '.json', '.css', '.html'].includes(ext)) {
             dispatch(openProcess({
               appId: 'Notepad',
               title: filename,
               icon: '/assets/icons/notepad.svg',
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
  };

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
      const fileList = await readdir(currentPath);
      setFiles(fileList);
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
      const fileList = await readdir(currentPath);
      setFiles(fileList);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ExplorerContainer>
      <Toolbar>
        <IconButton onClick={handleUp} title="Back"><ArrowLeft size={16}/></IconButton>
        <AddressBar value={currentPath} readOnly />
        <IconButton onClick={createNewFile} title="New File"><FilePlus size={16}/></IconButton>
        <IconButton onClick={createNewFolder} title="New Folder"><FolderPlus size={16}/></IconButton>
      </Toolbar>
      <FileList data-folder-path={currentPath}>
        {files.map(file => (
          <FileItem 
            key={file} 
            onDoubleClick={() => openFile(file)}
            data-file-path={pathModule.join(currentPath, file)}
          >
             {/* Simple heuristic for icon */}
            {file.endsWith('.project') ? (
              <Folder size={32} color="#D2691E" fill="rgba(210, 105, 30, 0.2)" /> 
            ) : !file.includes('.') ? (
              <Folder size={32} color="#D2691E" /> 
            ) : (
              <FileText size={32} color="#8C7B68" />
            )}
            <FileName>{file}</FileName>
          </FileItem>
        ))}
      </FileList>
    </ExplorerContainer>
  );
};

export default FileExplorer;
