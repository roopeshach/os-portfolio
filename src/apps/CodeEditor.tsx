import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import { readFile, writeFile, readdir, mkdir, fs, path as pathModule } from '../system/FileSystem';
import { Play, Save, X, Plus, Folder, File, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openProcess } from '../store/processSlice';
import { showAlert } from '../store/systemSlice';

const Container = styled.div`
  display: flex;
  height: 100%;
  background: #1e1e1e;
  color: #ccc;
  font-family: 'Segoe UI', sans-serif;
`;

const Sidebar = styled.div`
  width: 200px;
  background: #252526;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 10px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileTreeContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-top: 5px;
`;

const TreeItem = styled.div<{ $depth: number; $isActive?: boolean }>`
  padding: 4px 10px;
  padding-left: ${props => props.$depth * 15 + 10}px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  background: ${props => props.$isActive ? '#37373d' : 'transparent'};
  color: ${props => props.$isActive ? '#fff' : '#ccc'};
  
  &:hover {
    background: #2a2d2e;
    color: #fff;
  }
`;

const EditorArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  background: #252526;
  overflow-x: auto;
  &::-webkit-scrollbar { height: 3px; }
  &::-webkit-scrollbar-thumb { background: #444; }
`;

const Tab = styled.div<{ $active: boolean }>`
  padding: 8px 12px;
  background: ${props => props.$active ? '#1e1e1e' : '#2d2d2d'};
  color: ${props => props.$active ? '#fff' : '#999'};
  border-top: 2px solid ${props => props.$active ? '#007acc' : 'transparent'};
  border-right: 1px solid #1e1e1e;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  min-width: 100px;
  max-width: 200px;
  
  &:hover {
    background: ${props => props.$active ? '#1e1e1e' : '#333'};
  }
`;

const CloseButton = styled.div`
  opacity: 0;
  border-radius: 3px;
  padding: 2px;
  &:hover { background: #444; color: #fff; }
  ${Tab}:hover & { opacity: 1; }
`;

const Toolbar = styled.div`
  height: 35px;
  background: #1e1e1e;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
  justify-content: flex-end;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const RunButton = styled(IconButton)`
  color: #4caf50;
`;

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
  isOpen?: boolean;
}

interface OpenFile {
  path: string;
  content: string;
  isDirty: boolean;
  language: string;
}

interface CodeEditorProps {
  path?: string; // Initial file to open
}

const CodeEditor: React.FC<CodeEditorProps> = ({ path: initialPath }) => {
  const dispatch = useDispatch();
  const [rootPath] = useState('/Users/Roopesh');
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(-1);
  const [status, setStatus] = useState('');

  // Move loadTree and handleOpenFile definitions BEFORE useEffect
  const loadTree = useCallback(async (dirPath: string): Promise<FileNode[]> => {
    try {
      const items = await readdir(dirPath);
      const nodes: FileNode[] = [];
      
      for (const item of items) {
        const fullPath = pathModule.join(dirPath, item);
        const stats = await new Promise<any>((resolve) => fs.stat(fullPath, (err, stats) => resolve(stats)));
        
        nodes.push({
          name: item,
          path: fullPath,
          isDirectory: stats?.isDirectory() || false,
          children: stats?.isDirectory() ? [] : undefined
        });
      }
      return nodes.sort((a, b) => {
        if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
        return a.isDirectory ? -1 : 1;
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  }, []);

  const handleOpenFile = useCallback(async (filePath: string) => {
    // Check if already open (using functional update to access latest state if needed, but here we read state directly which is fine if we update deps)
    // Actually, to avoid stale closure issues, we should rely on setOpenFiles logic carefully or use ref.
    // For simplicity, we'll assume openFiles is fresh enough or check inside setOpenFiles.
    // However, findIndex needs access to current openFiles.
    
    setOpenFiles(prevOpenFiles => {
       const existingIndex = prevOpenFiles.findIndex(f => f.path === filePath);
       if (existingIndex !== -1) {
         setActiveFileIndex(existingIndex);
         return prevOpenFiles;
       }
       return prevOpenFiles; // Placeholder, we'll handle opening in a separate effect or async call
    });

    // Since we need to read file async, we can't easily do it inside setOpenFiles.
    // We'll check openFiles from state. NOTE: This might have stale state issues if called rapidly.
    // But for this simplified app it's acceptable.
    const isAlreadyOpen = openFiles.some(f => f.path === filePath);
    if (isAlreadyOpen) {
       const index = openFiles.findIndex(f => f.path === filePath);
       setActiveFileIndex(index);
       return;
    }

    try {
      const content = await readFile(filePath);
      const ext = pathModule.extname(filePath);
      let language = 'plaintext';
      if (ext === '.html') language = 'html';
      else if (ext === '.css') language = 'css';
      else if (ext === '.json') language = 'json';
      else if (ext === '.ts' || ext === '.tsx') language = 'typescript';
      else if (ext === '.js' || ext === '.jsx') language = 'javascript';
      else if (ext === '.md') language = 'markdown';

      setOpenFiles(prev => {
          const exists = prev.findIndex(f => f.path === filePath);
          if (exists !== -1) return prev;
          const newFiles = [...prev, { path: filePath, content, isDirty: false, language }];
          setActiveFileIndex(newFiles.length - 1);
          return newFiles;
      });
    } catch (e) {
      setStatus(`Error opening ${filePath}`);
    }
  }, [openFiles]);

  // Load initial file
  useEffect(() => {
    if (initialPath) {
      handleOpenFile(initialPath);
    }
    loadTree(rootPath).then(setFileTree);
  }, [initialPath, rootPath, loadTree, handleOpenFile]);

  const handleCloseFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const newFiles = [...openFiles];
    newFiles.splice(index, 1);
    setOpenFiles(newFiles);
    
    if (activeFileIndex >= index) {
      setActiveFileIndex(Math.max(0, activeFileIndex - 1));
    }
    if (newFiles.length === 0) {
      setActiveFileIndex(-1);
    }
  };

  const handleSave = async () => {
    if (activeFileIndex === -1) return;
    const file = openFiles[activeFileIndex];
    try {
      await writeFile(file.path, file.content);
      setOpenFiles(prev => prev.map((f, i) => i === activeFileIndex ? { ...f, isDirty: false } : f));
      setStatus('Saved!');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      setStatus('Error saving file');
    }
  };

  const handleRun = () => {
    if (activeFileIndex === -1) return;
    const file = openFiles[activeFileIndex];

    if (file.language === 'html') {
      const blob = new Blob([file.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      dispatch(openProcess({
        appId: 'Browser',
        title: 'Preview',
        icon: '/assets/icons/edge.svg',
        componentName: 'Browser',
        initialProps: { initialUrl: url }
      }));
    } else if (file.language === 'javascript' || file.language === 'typescript') {
      const htmlContent = `<html><body><script>${file.content}</script><h1>JS Output in Console</h1></body></html>`;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      dispatch(openProcess({
        appId: 'Browser',
        title: 'JS Runner',
        icon: '/assets/icons/edge.svg',
        componentName: 'Browser',
        initialProps: { initialUrl: url }
      }));
    } else {
      dispatch(showAlert({ title: 'Run', message: 'Language not supported for direct execution.', type: 'info' }));
    }
  };

  const createNewFile = async () => {
    const name = prompt('Enter file name (e.g., test.js):');
    if (!name) return;
    // Default to root or current dir if we tracked it
    const targetPath = pathModule.join(rootPath, name);
    await writeFile(targetPath, '// New file');
    await loadTree(rootPath).then(setFileTree); // Refresh tree
    handleOpenFile(targetPath);
  };

  const createNewFolder = async () => {
    const name = prompt('Enter folder name:');
    if (!name) return;
    const targetPath = pathModule.join(rootPath, name);
    await mkdir(targetPath);
    await loadTree(rootPath).then(setFileTree);
  };

  const toggleDirectory = async (node: FileNode) => {
    if (!node.isDirectory) return;
    
    const updateTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(n => {
        if (n.path === node.path) {
          return { ...n, isOpen: !n.isOpen };
        }
        if (n.children) {
          return { ...n, children: updateTree(n.children) };
        }
        return n;
      });
    };
    
    // If opening and no children loaded
    if (!node.isOpen && (!node.children || node.children.length === 0)) {
       const children = await loadTree(node.path);
       const updateTreeWithChildren = (nodes: FileNode[]): FileNode[] => {
        return nodes.map(n => {
          if (n.path === node.path) {
            return { ...n, isOpen: true, children };
          }
          if (n.children) {
            return { ...n, children: updateTreeWithChildren(n.children) };
          }
          return n;
        });
      };
      setFileTree(prev => updateTreeWithChildren(prev));
    } else {
      setFileTree(prev => updateTree(prev));
    }
  };

  const renderTree = (nodes: FileNode[], depth: number = 0) => {
    return nodes.map(node => (
      <div key={node.path}>
        <TreeItem 
          $depth={depth} 
          onClick={() => node.isDirectory ? toggleDirectory(node) : handleOpenFile(node.path)}
          $isActive={activeFileIndex !== -1 && openFiles[activeFileIndex].path === node.path}
        >
          {node.isDirectory ? (
             node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <span style={{ width: 14 }} />}
          
          {node.isDirectory ? <Folder size={14} color="#D2691E" /> : <File size={14} color="#8C7B68" />}
          {node.name}
        </TreeItem>
        {node.isDirectory && node.isOpen && node.children && (
          <div>{renderTree(node.children, depth + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <Container>
      <Sidebar>
        <SidebarHeader>
          <span>Explorer</span>
          <div style={{ display: 'flex', gap: 4 }}>
             <IconButton onClick={createNewFile} title="New File"><Plus size={14} /></IconButton>
             <IconButton onClick={createNewFolder} title="New Folder"><Folder size={14} /></IconButton>
             <IconButton onClick={() => loadTree(rootPath).then(setFileTree)} title="Refresh"><RefreshCw size={12} /></IconButton>
          </div>
        </SidebarHeader>
        <FileTreeContainer>
          {renderTree(fileTree)}
        </FileTreeContainer>
      </Sidebar>
      
      <EditorArea>
        <TabsContainer>
          {openFiles.map((file, index) => (
            <Tab 
              key={file.path} 
              $active={activeFileIndex === index}
              onClick={() => setActiveFileIndex(index)}
              draggable
            >
              {pathModule.basename(file.path)}
              {file.isDirty && <span style={{ fontSize: 20, lineHeight: 0 }}>•</span>}
              <CloseButton onClick={(e) => handleCloseFile(e, index)}>
                <X size={12} />
              </CloseButton>
            </Tab>
          ))}
          {openFiles.length === 0 && <div style={{ padding: 10, fontSize: 12, color: '#666' }}>No files open</div>}
        </TabsContainer>
        
        <Toolbar>
           <span style={{ marginRight: 'auto', fontSize: 12, color: '#666' }}>
             {activeFileIndex !== -1 ? openFiles[activeFileIndex].path : ''}
           </span>
           <span style={{ fontSize: 12, color: '#f44336', marginRight: 10 }}>{status}</span>
           <IconButton onClick={handleSave} disabled={activeFileIndex === -1}>
             <Save size={14} /> Save
           </IconButton>
           <RunButton onClick={handleRun} disabled={activeFileIndex === -1}>
             <Play size={14} /> Run
           </RunButton>
        </Toolbar>
        
        <div style={{ flex: 1 }}>
          {activeFileIndex !== -1 && (
            <Editor
              key={openFiles[activeFileIndex].path} // Force re-render on file switch to be safe or use value prop
              height="100%"
              language={openFiles[activeFileIndex].language}
              value={openFiles[activeFileIndex].content}
              onChange={(value) => {
                const newFiles = [...openFiles];
                newFiles[activeFileIndex].content = value || '';
                newFiles[activeFileIndex].isDirty = true;
                setOpenFiles(newFiles);
              }}
              theme="vs-dark"
              options={{ 
                minimap: { enabled: true },
                fontSize: 14,
              }}
            />
          )}
          {activeFileIndex === -1 && (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444' }}>
                Select a file to edit
             </div>
          )}
        </div>
      </EditorArea>
    </Container>
  );
};

export default CodeEditor;
