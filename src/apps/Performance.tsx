import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Activity, Cpu, HardDrive, Zap } from 'lucide-react';

const Container = styled.div`
  height: 100%;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.windowBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ValueDisplay = styled.div`
  font-size: 32px;
  font-weight: 300;
  font-family: 'Fira Code', monospace;
  color: ${props => props.theme.colors.accent};
  margin-bottom: 5px;
`;

const Graph = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
  padding: 5px;
  overflow: hidden;
`;

const Bar = styled.div<{ height: number }>`
  flex: 1;
  background: ${props => props.theme.colors.accent};
  height: ${props => props.height}%;
  opacity: 0.6;
  transition: height 0.2s;
`;

const Performance: React.FC = () => {
  const [cpuUsage, setCpuUsage] = useState<number[]>(new Array(20).fill(0));
  const [memUsage, setMemUsage] = useState<number[]>(new Array(20).fill(0));
  const [fps, setFps] = useState(60);
  const [domNodes, setDomNodes] = useState(0);

  useEffect(() => {
    let lastTime = performance.now();
    let frame = 0;

    const tick = () => {
      frame++;
      const time = performance.now();
      if (time >= lastTime + 1000) {
        setFps(Math.round((frame * 1000) / (time - lastTime)));
        frame = 0;
        lastTime = time;
      }
      requestAnimationFrame(tick);
    };
    
    requestAnimationFrame(tick);

    const interval = setInterval(() => {
      // Mock CPU/Mem fluctuations based on randomness + some logic
      setCpuUsage(prev => [...prev.slice(1), Math.random() * 30 + 10]);
      setMemUsage(prev => {
        // Mock memory: base + random
        const perf = performance as unknown as { memory?: { usedJSHeapSize: number } };
        const used = perf.memory?.usedJSHeapSize 
          ? perf.memory.usedJSHeapSize / 1024 / 1024 
          : Math.random() * 100 + 200;
        return [...prev.slice(1), Math.min(100, (used / 500) * 100)];
      });
      setDomNodes(document.getElementsByTagName('*').length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      <Card>
        <CardHeader>
          <Cpu size={18} />
          <span>CPU Usage (Simulated)</span>
        </CardHeader>
        <ValueDisplay>{Math.round(cpuUsage[cpuUsage.length - 1])}%</ValueDisplay>
        <Graph>
          {cpuUsage.map((v, i) => <Bar key={i} height={v} />)}
        </Graph>
      </Card>

      <Card>
        <CardHeader>
          <HardDrive size={18} />
          <span>Memory Usage (JS Heap)</span>
        </CardHeader>
        <ValueDisplay>{Math.round(memUsage[memUsage.length - 1])}%</ValueDisplay>
        <Graph>
          {memUsage.map((v, i) => <Bar key={i} height={v} />)}
        </Graph>
      </Card>

      <Card>
        <CardHeader>
          <Activity size={18} />
          <span>FPS</span>
        </CardHeader>
        <ValueDisplay>{fps}</ValueDisplay>
        <div style={{ fontSize: 12, color: '#aaa' }}>Target: 60 FPS</div>
      </Card>

      <Card>
        <CardHeader>
          <Zap size={18} />
          <span>DOM Nodes</span>
        </CardHeader>
        <ValueDisplay>{domNodes}</ValueDisplay>
        <div style={{ fontSize: 12, color: '#aaa' }}>Total elements in document</div>
      </Card>
    </Container>
  );
};

export default Performance;
