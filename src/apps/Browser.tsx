import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px;
  background: #f0f0f0;
  border-bottom: 1px solid #ccc;
  align-items: center;
`;

const AddressBar = styled.input`
  flex: 1;
  padding: 5px 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 14px;
  color: black;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: black;
  display: flex;
  align-items: center;
  &:hover { background: #ddd; }
`;

const BrowserContent = styled.div`
  flex: 1;
  position: relative;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const Browser: React.FC = () => {
  const [url, setUrl] = useState('https://roopeshachrya.com.np'); // Fallback to personal site or bing/google
  const [inputUrl, setInputUrl] = useState(url);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl;
    if (!target.startsWith('http')) {
      target = 'https://' + target;
    }
    setUrl(target);
  };

  return (
    <Container>
      <Toolbar>
        <IconButton><ArrowLeft size={16} /></IconButton>
        <IconButton><ArrowRight size={16} /></IconButton>
        <IconButton onClick={() => setUrl(url)}><RotateCw size={16} /></IconButton>
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex' }}>
          <AddressBar 
            value={inputUrl} 
            onChange={(e) => setInputUrl(e.target.value)} 
            onFocus={(e) => e.target.select()}
          />
        </form>
      </Toolbar>
      <BrowserContent>
        {/* Note: Many sites block iframes (X-Frame-Options). */}
        <Iframe src={url} title="Browser" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
      </BrowserContent>
    </Container>
  );
};

export default Browser;
