import React, { useEffect, useRef } from 'react';

const MatrixRain = ({ className = "" }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // precise sizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Matrix characters - mixing binary, heavy data, and katakana for the classic feel
        const chars = '010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const charArray = chars.split('');
        
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        
        // One drop per column
        // Initialize drops at random y positions to avoid the "curtain" effect on load
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // start above screen
        }

        const draw = () => {
            // Semi-transparent black to create fade effect
            ctx.fillStyle = 'rgba(2, 4, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0F0'; // Green text
            ctx.font = `${fontSize}px "Space Mono", monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = charArray[Math.floor(Math.random() * charArray.length)];
                
                // Color variation for aesthetic
                const isBright = Math.random() > 0.975;
                ctx.fillStyle = isBright ? '#ABF' : '#00E0FF'; // Cyber blue/cyan mix instead of pure green
                if (isBright) ctx.shadowBlur = 8;
                else ctx.shadowBlur = 0;
                ctx.shadowColor = '#00E0FF';

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop or move it down
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33); // ~30fps

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className={`fixed inset-0 z-0 pointer-events-none ${className}`}
        />
    );
};

export default MatrixRain;
