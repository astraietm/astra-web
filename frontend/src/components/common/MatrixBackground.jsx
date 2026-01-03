import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        const columns = Math.floor(width / 20);
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const chars = "XY01"; // Simplify to binary/code-like
        
        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(2, 4, 10, 0.05)'; 
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#00E0FF'; // Cyber Blue/Cyan
            ctx.font = '14px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                
                // Randomly vary opacity for "glitchy" feel
                ctx.fillStyle = `rgba(0, 224, 255, ${Math.random() * 0.5 + 0.1})`;
                
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 50);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20"
        />
    );
};

export default MatrixBackground;
