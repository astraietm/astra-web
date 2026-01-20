import React from 'react';
import { motion } from 'framer-motion';

const CyberBackground = ({ fixed = true }) => {
    const positionClass = fixed ? "fixed" : "absolute";
    
    return (
        <>
            {/* 1. Base Gradient */}
            <div className={`${positionClass} inset-0 bg-black/90 pointer-events-none z-[-1]`}></div>
            
            {/* 2. Cyber Noise REMOVED (Provided by MainLayout NoiseOverlay) */}

            {/* 3. Moving Scanlines - Desktop Only */}
            <div className={`${positionClass} inset-0 pointer-events-none overflow-hidden z-0 opacity-50 hidden md:block`}>
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20"></div>
                <motion.div 
                    initial={{ translateY: "-100%" }}
                    animate={{ translateY: "100%" }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-20"
                />
            </div>

            {/* 4. Glowing Cyber Orbs REMOVED (Provided by MainLayout BackgroundOrbs) */}

            {/* 5. Active Cyber Terminal Commands */}
            <div className={`${positionClass} inset-0 pointer-events-none z-0 overflow-hidden font-mono text-[10px] md:text-xs`}>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.4, x: 0 }} transition={{ delay: 0.5, duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-[100px] left-[5%] text-cyan-500/30"
                >
                    {">"} sudo astra_init --force <br/>
                    [ ok ] Loading Modules... <br/> 
                    [ ok ] Bypassing Firewall...
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 0.4, x: 0 }} transition={{ delay: 1.2, duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-[200px] right-[8%] text-blue-500/30 text-right"
                >
                    {">"} netstat -an | grep LISTEN <br/>
                    TCP 0.0.0.0:80 LISTENING <br/>
                    TCP 0.0.0.0:443 LISTENING
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.3, y: 0 }} transition={{ delay: 2, duration: 4, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-[20%] left-[10%] text-green-500/20"
                >
                    Analyzing Network Packets... <br/>
                    |||||||||||||||| 45%
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 0.8, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute bottom-[30%] right-[15%] text-purple-500/30 text-right"
                >
                    ENCRYPTING_PAYLOAD... <br/>
                    KEY_EXCHANGE_SUCCESS
                </motion.div>
            </div>
        </>
    );
};

export default CyberBackground;
