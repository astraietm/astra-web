import React from 'react';
import { motion } from 'framer-motion';

const CyberCube = ({ size = 64, color = "rgba(0, 224, 255, 0.5)", duration = 10, delay = 0 }) => {
    const halfSize = size / 2;

    const faceStyle = {
        position: 'absolute',
        width: size,
        height: size,
        border: `1px solid ${color}`,
        background: `rgba(0, 224, 255, 0.05)`,
        boxShadow: `0 0 15px ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backfaceVisibility: 'visible',
    };

    return (
        <motion.div
            style={{
                width: size,
                height: size,
                position: 'relative',
                transformStyle: 'preserve-3d',
            }}
            animate={{
                rotateX: [0, 360],
                rotateY: [0, 360],
                rotateZ: [0, 180]
            }}
            transition={{
                duration: duration,
                ease: "linear",
                repeat: Infinity,
                delay: delay
            }}
        >
            {/* Front */}
            <div style={{ ...faceStyle, transform: `translateZ(${halfSize}px)` }}>
                <div className="w-1/2 h-1/2 bg-current opacity-20" />
            </div>
            {/* Back */}
            <div style={{ ...faceStyle, transform: `rotateY(180deg) translateZ(${halfSize}px)` }} />
            {/* Right */}
            <div style={{ ...faceStyle, transform: `rotateY(90deg) translateZ(${halfSize}px)` }}>
                 <div className="w-full h-[1px] bg-current opacity-50" />
            </div>
            {/* Left */}
            <div style={{ ...faceStyle, transform: `rotateY(-90deg) translateZ(${halfSize}px)` }} />
            {/* Top */}
            <div style={{ ...faceStyle, transform: `rotateX(90deg) translateZ(${halfSize}px)` }} />
            {/* Bottom */}
            <div style={{ ...faceStyle, transform: `rotateX(-90deg) translateZ(${halfSize}px)` }}>
                <div className="w-[1px] h-full bg-current opacity-50" />
            </div>
        </motion.div>
    );
};

export default CyberCube;
