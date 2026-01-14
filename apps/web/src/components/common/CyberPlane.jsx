import React, { useEffect, useRef } from 'react';

const CyberPlane = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let frameId;
        let time = 0;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);

        const draw = () => {
            time += 0.5;
            ctx.fillStyle = '#02040a';
            ctx.fillRect(0, 0, width, height);

            // Horizon line
            const horizonY = height * 0.55; 
            
            // Draw Grid (Floor)
            ctx.strokeStyle = 'rgba(0, 224, 255, 0.2)';
            ctx.lineWidth = 1;
            
            // Vertical perspective lines
            const centerX = width / 2;
            const fov = 300;
            
            // Draw darker top sky
            const gradient = ctx.createLinearGradient(0, 0, 0, horizonY);
            gradient.addColorStop(0, '#02040a');
            gradient.addColorStop(1, 'rgba(0, 224, 255, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, horizonY);

            // Floor Gradients
            const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height);
            floorGrad.addColorStop(0, 'rgba(0, 224, 255, 0.2)');
            floorGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = floorGrad;
            // ctx.fillRect(0, horizonY, width, height - horizonY); // Optional fog on floor

            ctx.beginPath();
            // Radiating lines
            for (let i = -width; i < width * 2; i += 80) {
                // Determine x position based on perspective
                // Simple fan for now:
                ctx.moveTo(centerX, horizonY);
                // Spread out at bottom
                // Just drawing lines from center horizon to bottom edge?
                // Better: actual perspective math? 
                
                // Let's use a simpler "vanishing point" style
                const x = (i - centerX) * 4 + centerX;
                ctx.lineTo(x, height);
            }
            ctx.stroke();

            // Horizontal lines moving towards us
            const speed = 1.5;
            const offset = (time * speed) % 50;
            
            for (let y = 0; y < height - horizonY; y += 40) {
                // Perspective spacing?
                // Let's cheat. Just linear lines for "retro" feel, 
                // or exponential for depth?
                
                // Exponential spacing for true 3D feel
                // y is linear step. Z is projected.
                // We'll just draw lines that get further apart as they go down.
            }
            
            // Alternative: Draw horizontal lines based on Z-depth
            for (let z = 0; z < 2000; z += 100) {
                const zPos = (z - (time * 10) % 100);
                if (zPos <= 0) continue;
                
                const perspective = fov / zPos;
                const y = horizonY + (100 * perspective); // 100 is camera height
                
                if (y > height) continue;
                
                const alpha = Math.min(1, Math.pow(zPos / 1000, 0.5)); // Fade out near horizon? No, fade IN.
                // Fade out at far distance (high Z)
                // Fade in near camera (low Z)
                
                ctx.strokeStyle = `rgba(0, 224, 255, ${Math.max(0, 0.5 - zPos/2000)})`;
                
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw floating particles in the sky
             // We'll reuse the 'time' to move them
             for(let i=0; i<50; i++) {
                 const x = (i * 137.5 + time * 0.5) % width;
                 const y = (i * 37.2 + Math.sin(time * 0.01 + i) * 50) % horizonY;
                 const size = Math.random() * 2;
                 
                 ctx.fillStyle = `rgba(0, 224, 255, ${Math.random() * 0.5})`;
                 ctx.beginPath();
                 ctx.arc(x, y, size, 0, Math.PI * 2);
                 ctx.fill();
             }

            frameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
        />
    );
};

export default CyberPlane;
