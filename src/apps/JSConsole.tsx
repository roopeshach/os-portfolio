import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.brutalistYellow || '#ffd93d'};
  color: #000;
  font-family: 'Fira Code', monospace;
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
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 2px 2px 0 #000;
  &:hover { 
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 #000;
  }
`;

const Warning = styled.div`
  background: ${props => props.theme.colors.brutalistOrange || '#ff9f43'};
  color: #000;
  font-size: 11px;
  padding: 4px 8px;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
`;

const Editor = styled.textarea`
  flex: 1;
  background: #fff;
  color: #000;
  border: none;
  resize: none;
  padding: 10px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  font-weight: 500;
`;

const Output = styled.div`
  height: 150px;
  background: #1a1a2e;
  border-top: 3px solid #000;
  padding: 10px;
  overflow-y: auto;
  font-size: 13px;
  color: #fff;
`;

const LogLine = styled.div<{ type: 'log' | 'error' | 'warn' }>`
  color: ${props => 
    props.type === 'error' ? '#f48771' : 
    props.type === 'warn' ? '#cca700' : 
    '#d4d4d4'};
  margin-bottom: 4px;
  border-bottom: 1px solid #222;
  padding-bottom: 2px;
`;

const JSConsole: React.FC = () => {
  const [code, setCode] = useState('console.log("Hello from Roopesh Portfolio!");\nconst sum = 2 + 2;\nconsole.log("2 + 2 =", sum);');
  const [logs, setLogs] = useState<{ type: 'log' | 'error' | 'warn', content: string }[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  const runCode = () => {
    setLogs([]);
    
    // Create a sandbox-like environment
    // We override console.log within the scope of execution
    const captureLog = (type: 'log' | 'error' | 'warn', ...args: any[]) => {
      setLogs(prev => [...prev, { 
        type, 
        content: args.map(a => 
          typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
        ).join(' ') 
      }]);
    };

    try {
      // Create a function that wraps the user code
      // We pass a mocked console object
      const safeConsole = {
        log: (...args: unknown[]) => captureLog('log', ...args),
        error: (...args: unknown[]) => captureLog('error', ...args),
        warn: (...args: unknown[]) => captureLog('warn', ...args),
      };

      // Use Function constructor to limit scope (somewhat)
      // Note: This is client-side, so worst case they crash their own tab.
      // We don't expose sensitive tokens here.
      const run = new Function('console', `
        "use strict";
        try {
          ${code}
        } catch (e) {
          console.error(e.toString());
        }
      `);

      run(safeConsole);
    } catch (e: unknown) {
      captureLog('error', String(e));
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Container>
      <Toolbar>
        <Button onClick={runCode}><Play size={14} /> Run</Button>
        <Button onClick={() => setCode('')} style={{ background: '#444' }}><RotateCcw size={14} /> Clear</Button>
        <Warning>
          <AlertTriangle size={12} />
          <span>Client-side Execution Environment</span>
        </Warning>
      </Toolbar>
      <Editor 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        spellCheck={false}
      />
      <Output ref={outputRef}>
        <div style={{ color: '#666', marginBottom: 8 }}>Output Terminal</div>
        {logs.map((log, i) => (
          <LogLine key={i} type={log.type}>
            {i + 1} &gt; {log.content}
          </LogLine>
        ))}
      </Output>
    </Container>
  );
};

export default JSConsole;
