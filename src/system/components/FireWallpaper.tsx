import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: black;
  opacity: 0.8; /* Brighter */
`;

const FireWallpaper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Lower resolution for performance and "retro" look
    const fireWidth = Math.ceil(width / 8); 
    const fireHeight = Math.ceil(height / 8);
    const firePixels = new Array(fireWidth * fireHeight).fill(0);
    const colorPalette: string[] = [];

    // Generate Green/Purple Neon palette
    for (let i = 0; i < 256; i++) {
        let r = 0, g = 0, b = 0;
        
        // Map 0-255 to a Purple -> Green -> White gradient
        if (i < 85) {
           // Black to Deep Purple
           r = i * 2;
           g = 0;
           b = i * 3;
        } else if (i < 170) {
           // Purple to Teal/Green
           r = 170 - (i - 85) * 2;
           g = (i - 85) * 3;
           b = 255 - (i - 85);
        } else {
           // Teal to White
           r = (i - 170) * 3;
           g = 255;
           b = 170 + (i - 170);
        }
        
        // Clamp values
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        colorPalette[i] = `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
    }

    const spreadFire = (src: number) => {
        const pixel = firePixels[src];
        if (pixel === 0) {
            firePixels[src - fireWidth] = 0;
        } else {
            const rand = Math.round(Math.random() * 3);
            const dst = src - rand + 1;
            // Decay faster for shorter, subtle fire
            // Adding a constant decay factor (e.g., 1 or 2) makes it die out much quicker
            firePixels[dst - fireWidth] = Math.max(0, pixel - (rand & 3) - 2);
        }
    };

    const doFire = () => {
        for (let x = 0; x < fireWidth; x++) {
            for (let y = 1; y < fireHeight; y++) {
                spreadFire(y * fireWidth + x);
            }
        }
    };

    const drawCyberpunkOverlay = () => {
        // Draw Grid
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        // Vertical lines
        for (let x = 0; x <= width; x += 50) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        
        // Horizontal lines (perspective-ish)
        for (let y = 0; y <= height; y += 50) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Draw some random "floating" data particles
        // (We can simulate this with just static random dots for now or animate them)
        ctx.fillStyle = 'rgba(188, 19, 254, 0.3)';
        for(let i=0; i<20; i++) {
             const px = (frame * 2 + i * 100) % width;
             const py = (height/2) + Math.sin(frame * 0.02 + i) * 100;
             ctx.fillRect(px, py, 4, 4);
        }

        // Draw a "Horizon" line
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height - 50);
        ctx.lineTo(width, height - 50);
        ctx.stroke();
    };

    const draw = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Draw Fire Background
        const scaleX = width / fireWidth;
        const scaleY = height / fireHeight;

        for (let y = 0; y < fireHeight; y++) {
            for (let x = 0; x < fireWidth; x++) {
                const index = y * fireWidth + x;
                const colorIndex = firePixels[index];
                if (colorIndex > 0) {
                    ctx.fillStyle = colorPalette[colorIndex];
                    ctx.fillRect(x * scaleX, y * scaleY, scaleX + 1, scaleY + 1);
                }
            }
        }

        // Overlay Cyberpunk Elements
        drawCyberpunkOverlay();
    };

    const updateBottom = () => {
        for (let x = 0; x < fireWidth; x++) {
             const index = (fireHeight - 1) * fireWidth + x;
             // Lower intensity for softer, "gist" like fire
             firePixels[index] = Math.floor(Math.random() * 100); 
        }
    };
    
    // Initialize bottom row
    for (let x = 0; x < fireWidth; x++) {
        const index = (fireHeight - 1) * fireWidth + x;
        firePixels[index] = 100; // Start lower
    }

    let animationId: number;
    let frame = 0;

    const loop = () => {
        frame++;
        // Slow down update rate (every 3rd frame for slower fire)
        if (frame % 3 === 0) {
            if(frame % 15 === 0) updateBottom();
            doFire();
            draw();
        }
        animationId = requestAnimationFrame(loop);
    };

    loop();

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default FireWallpaper;
