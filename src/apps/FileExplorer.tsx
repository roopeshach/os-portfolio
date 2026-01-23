import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { readdir, fs, path as pathModule } from '../system/FileSystem';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { showAlert } from '../store/systemSlice';
import { 
  Folder, FileText, ArrowLeft
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

  return (
    <ExplorerContainer>
      <Toolbar>
        <button onClick={handleUp}><ArrowLeft size={16}/></button>
        <AddressBar value={currentPath} readOnly />
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
              <Folder size={32} color="#00d8ff" fill="rgba(0, 216, 255, 0.2)" /> 
            ) : !file.includes('.') ? (
              <Folder size={32} color="#fcd12a" /> 
            ) : (
              <FileText size={32} color="#0078d7" />
            )}
            <FileName>{file}</FileName>
          </FileItem>
        ))}
      </FileList>
    </ExplorerContainer>
  );
};

export default FileExplorer;
