import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Terminal, Activity, Layers, Cpu } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #242424;
  color: #e0e0e0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
`;

const Toolbar = styled.div`
  display: flex;
  background: #333;
  border-bottom: 1px solid #1e1e1e;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#1e1e1e' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#aaa'};
  border: none;
  border-top: 2px solid ${props => props.$active ? '#007acc' : 'transparent'};
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    color: #fff;
    background: #2d2d2d;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  padding: 10px;
  background: #1e1e1e;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  color: #569cd6;
  font-size: 14px;
  border-bottom: 1px solid #333;
  padding-bottom: 4px;
`;

const KeyValue = styled.div`
  display: flex;
  margin-bottom: 4px;
  
  span:first-child {
    color: #9cdcfe;
    min-width: 120px;
  }
  
  span:last-child {
    color: #ce9178;
  }
`;

const ProcessItem = styled.div`
  padding: 8px;
  background: #252526;
  margin-bottom: 4px;
  border-left: 3px solid #4caf50;
  display: flex;
  justify-content: space-between;
`;

const DevTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'system' | 'processes' | 'console'>('system');
  const processes = useSelector((state: RootState) => state.process.processes);
  const settings = useSelector((state: RootState) => state.settings);

  // Simulated console logs
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Capture console logs (simplified)
    const originalLog = console.log;
    console.log = (...args) => {
      setLogs(prev => [...prev.slice(-49), `[LOG] ${args.join(' ')}`]);
      originalLog(...args);
    };
    return () => {
      console.log = originalLog;
    };
  }, []);

  return (
    <Container>
      <Toolbar>
        <Tab $active={activeTab === 'system'} onClick={() => setActiveTab('system')}>
          <Activity size={14} /> System
        </Tab>
        <Tab $active={activeTab === 'processes'} onClick={() => setActiveTab('processes')}>
          <Layers size={14} /> Processes
        </Tab>
        <Tab $active={activeTab === 'console'} onClick={() => setActiveTab('console')}>
          <Terminal size={14} /> Console
        </Tab>
      </Toolbar>
      
      <Content>
        {activeTab === 'system' && (
          <>
            <Section>
              <Title>Environment Info</Title>
              <KeyValue><span>OS Name:</span><span>RoopeshOS</span></KeyValue>
              <KeyValue><span>Version:</span><span>2.0.0-alpha</span></KeyValue>
              <KeyValue><span>User Agent:</span><span>{navigator.userAgent}</span></KeyValue>
              <KeyValue><span>Screen:</span><span>{window.screen.width}x{window.screen.height}</span></KeyValue>
              <KeyValue><span>Theme:</span><span>{settings.theme}</span></KeyValue>
            </Section>
            
            <Section>
              <Title>Performance</Title>
              <KeyValue><span>Memory Usage:</span><span>{(() => { try { return (performance as unknown as { memory: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ? Math.round((performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize / 1024 / 1024) + ' MB' : 'N/A' } catch { return 'N/A' } })()}</span></KeyValue>
              <KeyValue><span>Time Origin:</span><span>{performance.timeOrigin}</span></KeyValue>
            </Section>
          </>
        )}

        {activeTab === 'processes' && (
          <>
            <Section>
              <Title>Active Processes ({Object.keys(processes).length})</Title>
              {Object.values(processes).map(p => (
                <ProcessItem key={p.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Cpu size={14} color="#4caf50" />
                    <span style={{ fontWeight: 'bold', color: '#e0e0e0' }}>{p.title}</span>
                    <span style={{ color: '#666' }}>({p.appId})</span>
                  </div>
                  <span style={{ color: '#888' }}>ID: {p.id.split('-').pop()}</span>
                </ProcessItem>
              ))}
            </Section>
          </>
        )}

        {activeTab === 'console' && (
          <>
            <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
              {logs.map((log, i) => (
                <div key={i} style={{ borderBottom: '1px solid #333', padding: '4px 0', color: log.includes('[ERROR]') ? '#f44336' : '#e0e0e0' }}>
                  {log}
                </div>
              ))}
              {logs.length === 0 && <div style={{ color: '#666', fontStyle: 'italic' }}>No logs captured yet...</div>}
            </div>
          </>
        )}
      </Content>
    </Container>
  );
};

export default DevTools;
