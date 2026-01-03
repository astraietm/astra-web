import React, { useEffect, useRef } from 'react';

const RetroGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let offset = 0;
    
    // Grid settings
    const gridSize = 40;
    const speed = 0.5;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const drawLine = (x1, y1, x2, y2, opacity) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(0, 224, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#02040a');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      offset = (offset + speed) % gridSize;

      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
         // Fades out at edges
         const dist = Math.abs(x - width/2);
         const opacity = Math.max(0, 0.15 - (dist / width) * 0.2); 
         drawLine(x, 0, x, height, opacity);
      }

      // Horizontal lines (moving down)
      for (let y = offset; y <= height; y += gridSize) {
        const dist = Math.abs(y - height/2);
        const opacity = Math.max(0, 0.15 - (dist / height) * 0.2);
        drawLine(0, y, width, y, opacity);
      }

      // Add "stars" or particles
      // Fixed particles for now to keep it performant
      
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen" />;
};

export default RetroGrid;
