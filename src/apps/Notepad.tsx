import React, { useState, useEffect, useCallback } from 'react';
import { readFile, writeFile } from '../system/FileSystem';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { useSystemModal } from '../hooks/useSystemModal';

interface NotepadProps {
  path?: string;
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  color: #000;
`;

const Toolbar = styled.div`
  padding: 8px;
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  border-bottom: 3px solid #000;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Button = styled.button`
  background: ${props => props.theme.colors.brutalistPink || '#ff6b9d'};
  color: #000;
  border: 3px solid #000;
  padding: 6px 12px;
  cursor: pointer;
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
`;

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const TextArea = styled.textarea`
  flex: 1;
  resize: none;
  padding: 15px;
  border: none;
  outline: none;
  font-family: 'Consolas', monospace;
  font-size: 14px;
  background: #fff;
  color: #000;
  font-weight: 500;
`;

const PreviewArea = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  border-left: 3px solid #000;
  background: #fff;
  color: #000;

  h1, h2, h3 { border-bottom: 3px solid #000; padding-bottom: 5px; font-weight: 800; }
  a { color: ${props => props.theme.colors.brutalistBlue || '#4d96ff'}; font-weight: 700; }
  code { background: ${props => props.theme.colors.brutalistGreen || '#6bcb77'}; padding: 2px 6px; border: 2px solid #000; color: #000; }
  pre { background: ${props => props.theme.colors.brutalistPurple || '#a66cff'}; padding: 10px; border: 3px solid #000; overflow-x: auto; color: #000; }
  ul, ol { padding-left: 20px; }
`;

const Notepad: React.FC<NotepadProps> = ({ path }) => {
  const [content, setContent] = useState('');
  const [currentPath, setCurrentPath] = useState(path || '');
  const [status, setStatus] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const modal = useSystemModal();

  const loadContent = async (filePath: string) => {
    try {
      const data = await readFile(filePath);
      setContent(data);
      setCurrentPath(filePath);
    } catch (e) {
      console.error(e);
      setStatus('Error loading file');
    }
  };

  useEffect(() => {
    if (path) {
      const load = async () => {
         await loadContent(path);
         if (path.endsWith('.md')) setShowPreview(true);
      };
      load();
    }
  }, [path]);

  const handleSave = useCallback(async () => {
    let targetPath = currentPath;
    if (!targetPath) {
      const newPath = await modal.prompt({
        title: 'Save As',
        message: 'Enter the path where you want to save the file:',
        defaultValue: '/Users/Roopesh/Documents/Untitled.txt',
        placeholder: 'File path',
        confirmText: 'Save',
      });
      if (newPath) {
        targetPath = newPath;
        setCurrentPath(newPath);
      } else {
        return;
      }
    }
    
    try {
      await writeFile(targetPath, content);
      setStatus('Saved');
      setTimeout(() => setStatus(''), 2000);
    } catch (e) {
      console.error(e);
      setStatus('Error saving');
    }
  }, [content, currentPath, modal]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        void handleSave();
      }
    };

    const onAppSave = () => {
      void handleSave();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('app:save', onAppSave as EventListener);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('app:save', onAppSave as EventListener);
    };
  }, [content, currentPath, handleSave]);

  return (
    <Container>
      <Toolbar>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? 'Edit Only' : 'Preview MD'}
        </Button>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>{currentPath}</span>
        <span style={{ marginLeft: 'auto', fontSize: '12px' }}>{status}</span>
      </Toolbar>
      <EditorContainer>
        <TextArea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type here..." 
        />
        {showPreview && (
          <PreviewArea>
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </PreviewArea>
        )}
      </EditorContainer>
    </Container>
  );
};

export default Notepad;
