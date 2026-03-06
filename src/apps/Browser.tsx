import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, ArrowRight, RotateCw, Plus, X, ExternalLink, Home } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  color: #000;
`;

const TabBar = styled.div`
  display: flex;
  background: ${props => props.theme.colors.brutalistBlue || '#4d96ff'};
  padding: 8px 8px 0 8px;
  gap: 4px;
  align-items: center;
  overflow-x: auto;
  border-bottom: 3px solid #000;
  &::-webkit-scrollbar { height: 0; }
`;

const Tab = styled.div<{ $active: boolean }>`
  padding: 8px 12px;
  background: ${props => props.$active ? props.theme.colors.brutalistGreen || '#6bcb77' : props.theme.colors.brutalistPink || '#ff6b9d'};
  border: 3px solid #000;
  border-bottom: ${props => props.$active ? 'none' : '3px solid #000'};
  font-size: 12px;
  max-width: 200px;
  min-width: 100px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  font-weight: 700;
  color: #000;
  box-shadow: ${props => props.$active ? 'none' : '2px 2px 0 #000'};
  transition: all 0.1s;
  
  &:hover {
    transform: ${props => props.$active ? 'none' : 'translate(-1px, -1px)'};
  }
`;

const TabTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
`;

const CloseTab = styled.div`
  padding: 2px;
  display: flex;
  &:hover { background: rgba(0,0,0,0.2); }
  color: #000;
`;

const NewTabButton = styled.button`
  background: ${props => props.theme.colors.brutalistOrange || '#ff9f43'};
  border: 3px solid #000;
  padding: 4px;
  cursor: pointer;
  display: flex;
  box-shadow: 2px 2px 0 #000;
  color: #000;
  &:hover { 
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #000;
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border-bottom: 3px solid #000;
  align-items: center;
`;

const AddressBar = styled.input`
  flex: 1;
  padding: 6px 12px;
  border: 3px solid #000;
  background: #fff;
  color: #000;
  font-weight: 600;
  font-family: 'Rajdhani', sans-serif;
  outline: none;
  font-size: 14px;
  transition: all 0.1s;
  
  &:focus {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #000;
  }
`;

const IconButton = styled.button`
  background: ${props => props.theme.colors.brutalistGreen || '#6bcb77'};
  border: 3px solid #000;
  cursor: pointer;
  padding: 6px;
  color: #000;
  display: flex;
  align-items: center;
  box-shadow: 2px 2px 0 #000;
  &:hover { 
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #000;
  }
  &:disabled { opacity: 0.3; cursor: default; transform: none; box-shadow: 2px 2px 0 #000; }
`;

const BrowserContent = styled.div`
  flex: 1;
  position: relative;
  background: #fff;
  border: 3px solid #000;
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
