import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        if (window.matchMedia("(pointer: coarse)").matches) {
            setIsMobile(true);
        }
    }, []);



    // Raw Mouse position (Instant)
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth physics ONLY for the outer reticle (Cinematic Lag)
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            // Update MotionValues directly (no re-render)
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === 'BUTTON' || 
                e.target.tagName === 'A' || 
                e.target.closest('button') || 
                e.target.closest('a') ||
                e.target.classList.contains('interactive')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        if (isMobile) return;

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.style.cursor = 'auto';
        };
    }, [isMobile]);

    if (isMobile) return null;

    return (
        <>
            {/* 1. The Dot (Instant Response) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
            >
                 <div className={`w-2 h-2 bg-green-500 rounded-full transition-transform duration-200 ${isHovering ? 'scale-0' : 'scale-100'}`} />
            </motion.div>

            {/* 2. The Reticle (Smooth Physics) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%'
                }}
            >
                <div 
                    className={`border border-green-500 rounded-full transition-all duration-300 flex items-center justify-center relative
                    ${isHovering ? 'w-16 h-16 border-green-500/50 rotate-90 scale-110' : 'w-8 h-8 border-green-500/40 rotate-0 scale-100'}`}
                >
                    {/* Crosshairs */}
                    <div className={`absolute top-1/2 left-0 w-full h-[1px] bg-green-500/40 transition-all duration-300 ${isHovering ? 'scale-x-100' : 'scale-x-0'}`} />
                    <div className={`absolute top-0 left-1/2 w-[1px] h-full bg-green-500/40 transition-all duration-300 ${isHovering ? 'scale-y-100' : 'scale-y-0'}`} />
                    
                    {/* Corner Brackets */}
                    {isHovering && (
                        <>
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500" />
                        </>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default CustomCursor;
