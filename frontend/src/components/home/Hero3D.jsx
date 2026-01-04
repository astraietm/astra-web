import React from 'react';
import { motion } from 'framer-motion';

// ----------------------------------------------------------------------
// CSS-ONLY 3D ENGINE (No WebGL/Canvas to prevent crashes)
// ----------------------------------------------------------------------

const CubeFace = ({ rotate, translate, color, visible = true, content }) => (
    <div 
        className="absolute w-64 h-64 border-2 border-cyan-500/50 bg-black/80 flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.2)]"
        style={{ 
            transform: `${rotate} translateZ(${translate})`,
            backfaceVisibility: 'visible', // Hardware retro style
        }}
    >
        {visible && (
            <div className="relative w-full h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    <div className="text-[10px] font-mono text-cyan-500">SYS.01</div>
                </div>
                {content || (
                    <div className="w-full h-px bg-cyan-500/30" />
                )}
                <div className="text-[8px] font-mono text-cyan-500/50 break-all">
                    0101010101010101
                </div>
            </div>
        )}
    </div>
);

const Hero3D = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black perspective-1000">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Rotating Container */}
        <motion.div 
            className="relative w-64 h-64 preserve-3d"
            animate={{ 
                rotateX: [0, 360], 
                rotateY: [0, 360] 
            }}
            transition={{ 
                duration: 20, 
                ease: "linear", 
                repeat: Infinity 
            }}
            style={{ transformStyle: 'preserve-3d' }}
        >
             {/* CORE CUBE */}
             <CubeFace rotate="rotateY(0deg)" translate="130px" />
             <CubeFace rotate="rotateY(90deg)" translate="130px" />
             <CubeFace rotate="rotateY(180deg)" translate="130px" />
             <CubeFace rotate="rotateY(270deg)" translate="130px" />
             <CubeFace rotate="rotateX(90deg)" translate="130px" />
             <CubeFace rotate="rotateX(-90deg)" translate="130px" />
             
             {/* Floating Ring 1 */}
             <motion.div 
                className="absolute inset-[-4rem] rounded-full border border-dashed border-green-500/30"
                animate={{ rotateX: 360, rotateY: 180 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: 'preserve-3d' }}
             />
             
             {/* Floating Ring 2 */}
             <motion.div 
                className="absolute inset-[-6rem] rounded-full border border-green-500/20"
                animate={{ rotateY: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: 'preserve-3d' }}
             />
        </motion.div>

        {/* Ambient Particles (CSS) */}
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-500 rounded-full opacity-50"
                    initial={{ x: Math.random() * 1000, y: Math.random() * 1000, opacity: 0 }}
                    animate={{ y: [null, Math.random() * -100], opacity: [0, 1, 0] }}
                    transition={{ duration: Math.random() * 5 + 5, repeat: Infinity }}
                />
            ))}
        </div>
    </div>
  );
};

export default Hero3D;
