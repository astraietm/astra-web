import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';

const CursorParallaxBackground = () => {
    const ref = useRef(null);

    // Mouse position motion values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring config
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    
    // Create smoothed mouse values
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const x = clientX / innerWidth - 0.5;
            const y = clientY / innerHeight - 0.5;
            
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Layer transforms (different depths)
    const x1 = useTransform(smoothX, [-0.5, 0.5], [50, -50]);
    const y1 = useTransform(smoothY, [-0.5, 0.5], [50, -50]);

    const x2 = useTransform(smoothX, [-0.5, 0.5], [20, -20]);
    const y2 = useTransform(smoothY, [-0.5, 0.5], [20, -20]);

    const x3 = useTransform(smoothX, [-0.5, 0.5], [-40, 40]); // Moves same direction as mouse? No, typically opposite. Let's invert.
    const y3 = useTransform(smoothY, [-0.5, 0.5], [-40, 40]);

    // Dynamic background gradient that shifts slightly
    const bgX = useTransform(smoothX, [-0.5, 0.5], ['0%', '20%']);
    const bgY = useTransform(smoothY, [-0.5, 0.5], ['0%', '20%']);

    return (
        <div 
            ref={ref} 
            className="absolute inset-0 z-0 overflow-hidden bg-[#02040a]"
        >
            {/* Base Gradient Layer */}
            <motion.div 
                style={{ x: x2, y: y2 }}
                className="absolute inset-[-10%] opacity-30"
            >
                 <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[100px] mix-blend-screen" />
                 <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
            </motion.div>

            {/* Grid Dots Layer (Far) */}
            <motion.div 
                style={{ x: x1, y: y1 }}
                className="absolute inset-[-10%]"
            >
                <div 
                    className="w-full h-full opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </motion.div>

            {/* Floating Shapes Layer (Close) */}
            <motion.div 
                style={{ x: x3, y: y3 }}
                className="absolute inset-0 pointer-events-none"
            >
                {/* Decorative Elements */}
                <div className="absolute top-[15%] right-[25%] w-4 h-4 border border-white/20 rounded-full" />
                <div className="absolute bottom-[35%] left-[15%] w-20 h-20 border border-primary/10 rounded-full" />
                <div className="absolute top-[40%] left-[40%] w-2 h-2 bg-white/20 rounded-full" />
                <div className="absolute bottom-[20%] right-[35%] w-32 h-32 border border-white/5 rounded-full" />
            </motion.div>

            {/* Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")` }}></div>
        </div>
    );
};

export default CursorParallaxBackground;
