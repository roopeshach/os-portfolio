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

const FireWallpaper: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  
  // Mouse tracking
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Scene Variables
    let frame = 0;
    
    // Static Shapes (Crystals)
    const shapes = Array.from({ length: 12 }, (_, i) => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 200 + 100, // Depth
      size: Math.random() * 40 + 20,
      baseRotX: Math.random() * Math.PI,
      baseRotY: Math.random() * Math.PI,
      type: Math.random() > 0.5 ? 'octahedron' : 'diamond' 
    }));

    const project = (x: number, y: number, z: number) => {
      const scale = 500 / (500 + z);
      const px = width / 2 + x * scale;
      const py = height / 2 + y * scale;
      return { x: px, y: py, scale };
    };

    const drawCrystal = (shape: typeof shapes[0], mx: number, my: number) => {
        const { x, y, z, size, baseRotX, baseRotY, type } = shape;
        
        // Interaction Rotation
        // Calculate vector from center to shape
        // Add mouse influence
        const rotX = baseRotX + my * 0.002;
        const rotY = baseRotY + mx * 0.002;

        let vertices: {x:number, y:number, z:number}[] = [];
        let edges: number[][] = [];

        if (type === 'octahedron') {
            // Octahedron Vertices
            vertices = [
                {x:0, y:size, z:0},      // 0: Top
                {x:0, y:-size, z:0},     // 1: Bottom
                {x:size, y:0, z:0},      // 2: Right
                {x:-size, y:0, z:0},     // 3: Left
                {x:0, y:0, z:size},      // 4: Front
                {x:0, y:0, z:-size},     // 5: Back
            ];
            // Octahedron Edges
            edges = [
                [0,2], [0,3], [0,4], [0,5], // Top pyramid
                [1,2], [1,3], [1,4], [1,5], // Bottom pyramid
                [2,4], [4,3], [3,5], [5,2]  // Middle ring
            ];
        } else {
             // Diamond / Prism
             vertices = [
                {x:0, y:size*1.2, z:0},   // 0: Top
                {x:0, y:-size*1.2, z:0},  // 1: Bottom
                {x:size*0.7, y:0, z:size*0.7},   // 2
                {x:-size*0.7, y:0, z:size*0.7},  // 3
                {x:-size*0.7, y:0, z:-size*0.7}, // 4
                {x:size*0.7, y:0, z:-size*0.7},  // 5
             ];
             edges = [
                 [0,2], [0,3], [0,4], [0,5],
                 [1,2], [1,3], [1,4], [1,5],
                 [2,3], [3,4], [4,5], [5,2]
             ];
        }

        // Rotate and Translate
        const projectedVerts = vertices.map(v => {
            let vx = v.x, vy = v.y, vz = v.z;

            // Rot X
            let dy = vy * Math.cos(rotX) - vz * Math.sin(rotX);
            let dz = vy * Math.sin(rotX) + vz * Math.cos(rotX);
            vy = dy; vz = dz;

            // Rot Y
            let dx = vx * Math.cos(rotY) - vz * Math.sin(rotY);
            dz = vx * Math.sin(rotY) + vz * Math.cos(rotY);
            vx = dx; vz = dz;

            return project(x + vx, y + vy, z + vz);
        });

        // Draw
        ctx.strokeStyle = theme.colors.accent; 
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        edges.forEach(edge => {
            const p1 = projectedVerts[edge[0]];
            const p2 = projectedVerts[edge[1]];
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
        });
        ctx.stroke();

        // Fill semi-transparent for "Crystal" look
        ctx.fillStyle = `${theme.colors.accent}11`; // Very transparent
        ctx.beginPath();
        // Simple hull fill for effect (not perfect 3d fill)
        if (projectedVerts.length > 0) {
            ctx.moveTo(projectedVerts[0].x, projectedVerts[0].y);
            projectedVerts.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.closePath();
            ctx.fill();
        }
    };

    const drawGrid = (mx: number, my: number) => {
       ctx.strokeStyle = theme.colors.textSecondary; 
       ctx.lineWidth = 0.5;
       ctx.beginPath();
       
       // Static grid, maybe slight parallax
       const parallaxX = mx * 0.05;
       const parallaxY = my * 0.05;

       const spacing = 100;
       
       // Vertical
       for (let x = -width; x < width * 2; x += spacing) {
           const p1 = project(x - width/2 - parallaxX, -200 - parallaxY, 0);
           const p2 = project(x - width/2 - parallaxX, -200 - parallaxY, 1000);
           ctx.moveTo(p1.x, p1.y);
           ctx.lineTo(p2.x, p2.y);
       }
       
       // Horizontal
       for (let z = 0; z < 1000; z += spacing) {
           const p1 = project(-width - parallaxX, -200 - parallaxY, z);
           const p2 = project(width - parallaxX, -200 - parallaxY, z);
           ctx.moveTo(p1.x, p1.y);
           ctx.lineTo(p2.x, p2.y);
       }
       ctx.stroke();
    };

    const draw = () => {
        ctx.fillStyle = theme.colors.background;
        ctx.fillRect(0, 0, width, height);

        // Current mouse target
        const targetX = mouse.current.x - width / 2;
        const targetY = mouse.current.y - height / 2;
        
        // Smooth follow
        // We can just use raw for crisp response or lerp. Raw is "more interactive".
        
        drawGrid(targetX, targetY);

        shapes.forEach(shape => {
            drawCrystal(shape, targetX, targetY);
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