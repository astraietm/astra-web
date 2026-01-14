import React from 'react';

const CircuitBoard = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
            <svg className="w-full h-full" width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(0, 224, 255, 0)" />
                        <stop offset="50%" stopColor="rgba(0, 224, 255, 0.5)" />
                        <stop offset="100%" stopColor="rgba(0, 224, 255, 0)" />
                    </linearGradient>
                </defs>

                {/* Circuit Path 1 (Top Left) */}
                <path 
                    d="M100,0 V100 L200,200 H400" 
                    fill="none" 
                    stroke="rgba(0, 224, 255, 0.1)" 
                    strokeWidth="2" 
                    className="circuit-path"
                />
                <circle cx="400" cy="200" r="3" fill="rgba(0, 224, 255, 0.3)" />

                {/* Circuit Path 2 (Bottom Right) */}
                <path 
                    d="M1340,900 V800 L1200,700 H900" 
                    fill="none" 
                    stroke="rgba(0, 224, 255, 0.1)" 
                    strokeWidth="2" 
                    className="circuit-path"
                />
                <circle cx="900" cy="700" r="3" fill="rgba(0, 224, 255, 0.3)" />

                {/* Circuit Path 3 (Right Mid) */}
                <path 
                    d="M1440,300 H1300 L1200,400 V600" 
                    fill="none" 
                    stroke="rgba(0, 224, 255, 0.1)" 
                    strokeWidth="2" 
                    className="circuit-path"
                />

                {/* Animated Data Packets */}
                <circle r="4" fill="url(#circuit-grad)">
                    <animateMotion 
                        dur="3s" 
                        repeatCount="indefinite" 
                        path="M100,0 V100 L200,200 H400" 
                    />
                </circle>

                <circle r="4" fill="url(#circuit-grad)">
                    <animateMotion 
                        dur="4s" 
                        repeatCount="indefinite" 
                        path="M1340,900 V800 L1200,700 H900"
                        keyPoints="1;0" 
                        keyTimes="0;1"
                    />
                </circle>
                 <circle r="4" fill="url(#circuit-grad)">
                    <animateMotion 
                        dur="5s" 
                        repeatCount="indefinite" 
                        path="M1440,300 H1300 L1200,400 V600"
                    />
                </circle>

                {/* Random Tech Decos */}
                <rect x="100" y="400" width="2" height="100" fill="rgba(0, 224, 255, 0.1)" />
                <rect x="110" y="420" width="2" height="60" fill="rgba(0, 224, 255, 0.1)" />
                
                <rect x="1300" y="100" width="2" height="80" fill="rgba(0, 224, 255, 0.1)" />
                <rect x="1290" y="120" width="2" height="40" fill="rgba(0, 224, 255, 0.1)" />
            </svg>
            
            {/* Horizontal Scanline */}
             <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[10%] animate-scan opacity-30"></div>
        </div>
    );
};

export default CircuitBoard;
