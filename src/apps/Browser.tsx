import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ArrowLeft, ArrowRight, RotateCw, Plus, X, ExternalLink, Home } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f0f0f0;
  color: #333;
`;

const TabBar = styled.div`
  display: flex;
  background: #dfe1e5;
  padding: 8px 8px 0 8px;
  gap: 4px;
  align-items: center;
  overflow-x: auto;
  &::-webkit-scrollbar { height: 0; }
`;

const Tab = styled.div<{ $active: boolean }>`
  padding: 8px 12px;
  background: ${props => props.$active ? '#fff' : 'transparent'};
  border-radius: 8px 8px 0 0;
  font-size: 12px;
  max-width: 200px;
  min-width: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  box-shadow: ${props => props.$active ? '0 -1px 4px rgba(0,0,0,0.1)' : 'none'};
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.$active ? '#fff' : '#e6e8eb'};
  }
`;

const TabTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CloseTab = styled.div`
  padding: 2px;
  border-radius: 50%;
  display: flex;
  &:hover { background: #ccc; }
`;

const NewTabButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  &:hover { background: #ccc; }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border-bottom: 1px solid #ddd;
  align-items: center;
`;

const AddressBar = styled.input`
  flex: 1;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 14px;
  background: #f1f3f4;
  color: #333;
  transition: all 0.2s;
  
  &:focus {
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-color: #4285f4;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  color: #5f6368;
  display: flex;
  align-items: center;
  &:hover { background: #eee; color: #333; }
  &:disabled { opacity: 0.3; cursor: default; }
`;

const BrowserContent = styled.div`
  flex: 1;
  position: relative;
  background: #fff;
`;

const IframeContainer = styled.div<{ $active: boolean }>`
  width: 100%;
  height: 100%;
  display: ${props => props.$active ? 'block' : 'none'};
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  z-index: 10;
  gap: 20px;
`;

interface TabData {
  id: number;
  url: string;
  title: string;
  loading: boolean;
}

const Browser: React.FC<{ initialUrl?: string }> = ({ initialUrl }) => {
  const [tabs, setTabs] = useState<TabData[]>([
    { id: 1, url: initialUrl || 'https://www.google.com/webhp?igu=1', title: 'Google', loading: true }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState('');
  
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (activeTab) {
      setUrlInput(activeTab.url);
    }
  }, [activeTab]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = urlInput.trim();
    
    if (!target) return;

    // Simple heuristic for URL vs Search
    const isUrl = target.includes('.') && !target.includes(' ') && !target.startsWith('?');
    
    if (!isUrl && !target.startsWith('http') && !target.startsWith('blob:')) {
       target = 'https://www.google.com/search?q=' + encodeURIComponent(target) + '&igu=1';
    } else if (!target.startsWith('http') && !target.startsWith('blob:')) {
       target = 'https://' + target;
    }
    
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: target, title: target, loading: true } : t));
  };

  const reload = () => {
    const currentUrl = activeTab.url;
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: '', loading: true } : t));
    setTimeout(() => {
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: currentUrl } : t));
    }, 10);
  };

  const addTab = () => {
    const newId = Math.max(0, ...tabs.map(t => t.id)) + 1;
    setTabs([...tabs, { id: newId, url: 'https://www.google.com/webhp?igu=1', title: 'New Tab', loading: true }]);
    setActiveTabId(newId);
  };

  const closeTab = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const openExternal = () => {
    window.open(activeTab.url, '_blank');
  };

  const goHome = () => {
     setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: 'https://www.google.com/webhp?igu=1', title: 'Google', loading: true } : t));
  };

  return (
    <Container>
      <TabBar>
        {tabs.map(tab => (
          <Tab 
            key={tab.id} 
            $active={tab.id === activeTabId}
            onClick={() => setActiveTabId(tab.id)}
          >
            <TabTitle>{tab.title}</TabTitle>
            <CloseTab onClick={(e) => closeTab(e, tab.id)}><X size={12} /></CloseTab>
          </Tab>
        ))}
        <NewTabButton onClick={addTab}><Plus size={16} /></NewTabButton>
      </TabBar>
      
      <Toolbar>
        <IconButton onClick={() => {}} disabled><ArrowLeft size={16} /></IconButton>
        <IconButton onClick={() => {}} disabled><ArrowRight size={16} /></IconButton>
        <IconButton onClick={reload}><RotateCw size={16} /></IconButton>
        <IconButton onClick={goHome}><Home size={16} /></IconButton>
        <form onSubmit={handleNavigate} style={{ flex: 1, display: 'flex' }}>
          <AddressBar 
            value={urlInput} 
            onChange={(e) => setUrlInput(e.target.value)} 
            onFocus={(e) => e.target.select()}
            placeholder="Search Google or type a URL"
          />
        </form>
        <IconButton onClick={openExternal} title="Open in real browser (Fixes refused connection)"><ExternalLink size={16} /></IconButton>
      </Toolbar>

      <BrowserContent>
        {tabs.map(tab => (
          <IframeContainer key={tab.id} $active={tab.id === activeTabId}>
            {tab.url && (
              <Iframe 
                src={tab.url} 
                title={`browser-tab-${tab.id}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
                onLoad={() => {
                   setTabs(prev => prev.map(t => t.id === tab.id ? { ...t, loading: false, title: t.url.replace('https://', '').split('/')[0] || 'Page' } : t));
                }}
              />
            )}
          </IframeContainer>
        ))}
      </BrowserContent>
    </Container>
  );
};

export default Browser;
