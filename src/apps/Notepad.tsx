import React, { useState, useEffect } from 'react';
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
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
`;

const Toolbar = styled.div`
  padding: 5px;
  background: ${props => props.theme.colors.taskbar};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Button = styled.button`
  background: ${props => props.theme.colors.accent};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
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
  padding: 10px;
  border: none;
  outline: none;
  font-family: 'Consolas', monospace;
  font-size: 14px;
  background: ${props => props.theme.colors.windowBackground};
  color: ${props => props.theme.colors.text};
`;

const PreviewArea = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  border-left: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.windowBackground};
  color: ${props => props.theme.colors.text};

  h1, h2, h3 { border-bottom: 1px solid ${props => props.theme.colors.border}; padding-bottom: 5px; }
  a { color: ${props => props.theme.colors.accent}; }
  code { background: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 3px; }
  pre { background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px; overflow-x: auto; }
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

  const handleSave = async () => {
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
  };

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
