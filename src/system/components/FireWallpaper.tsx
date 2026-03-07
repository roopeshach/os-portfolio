import React, { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: ${props => props.theme.colors.background};
`;

interface Shape {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'square' | 'triangle' | 'circle' | 'cross';
}

const FireWallpaper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const colors = [
      theme.colors.brutalistYellow || '#ffd93d',
      theme.colors.brutalistBlue || '#4d96ff',
      theme.colors.brutalistPink || '#ff6b9d',
      theme.colors.brutalistGreen || '#6bcb77',
      theme.colors.brutalistOrange || '#ff9f43',
      theme.colors.brutalistPurple || '#a66cff',
    ];

    // Generate random shapes
    const shapes: Shape[] = Array.from({ length: 15 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 60 + 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: (['square', 'triangle', 'circle', 'cross'] as const)[Math.floor(Math.random() * 4)],
    }));

    const drawShape = (shape: Shape, mx: number, my: number) => {
      const parallaxX = (mx - width / 2) * 0.02;
      const parallaxY = (my - height / 2) * 0.02;
      
      ctx.save();
      ctx.translate(shape.x + parallaxX, shape.y + parallaxY);
      ctx.rotate(shape.rotation);
      
      ctx.fillStyle = shape.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;

      const s = shape.size;

      switch (shape.type) {
        case 'square':
          ctx.fillRect(-s/2, -s/2, s, s);
          ctx.strokeRect(-s/2, -s/2, s, s);
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -s/2);
          ctx.lineTo(s/2, s/2);
          ctx.lineTo(-s/2, s/2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, s/2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        case 'cross': {
          const thickness = s / 3;
          ctx.beginPath();
          ctx.rect(-thickness/2, -s/2, thickness, s);
          ctx.rect(-s/2, -thickness/2, s, thickness);
          ctx.fill();
          ctx.strokeRect(-thickness/2, -s/2, thickness, s);
          ctx.strokeRect(-s/2, -thickness/2, s, thickness);
          break;
        }
      }
      
      ctx.restore();
    };

    const drawGrid = () => {
      ctx.strokeStyle = `${theme.colors.accent}30`;
      ctx.lineWidth = 1;
      const spacing = 50;
      
      for (let x = 0; x < width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y < height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const draw = () => {
      ctx.fillStyle = theme.colors.background;
      ctx.fillRect(0, 0, width, height);
      
      drawGrid();
      
      shapes.forEach(shape => {
        shape.rotation += shape.rotationSpeed;
        drawShape(shape, mouse.current.x, mouse.current.y);
      });
    };

    let animationId: number;
    const loop = () => {
      draw();
      animationId = requestAnimationFrame(loop);
    };
    loop();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return <Canvas ref={canvasRef} />;
};

export default FireWallpaper;