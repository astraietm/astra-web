import React, { useEffect, useState } from 'react';

const Maintenance = () => {
    const [logs, setLogs] = useState(["Initializing secure shell..."]);

    useEffect(() => {
        const messages = [
            "Encrypting data streams...",
            "Verifying integrity hashes...",
            "Optimizing neural core...",
            "Syncing database clusters...",
            "Flushing cache buffers...",
            "Rebooting security nodes..."
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            setLogs(prev => {
                const newLogs = [...prev, messages[i]];
                if (newLogs.length > 3) newLogs.shift();
                return newLogs;
            });
            i = (i + 1) % messages.length;
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0, backgroundColor: '#030409', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif"
        }}>
           <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
                .glow-spot { position: absolute; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(0, 243, 255, 0.05) 0%, transparent 70%); pointer-events: none; }
                .glass-card { background: rgba(10, 15, 30, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(0, 243, 255, 0.2); box-shadow: 0 0 30px rgba(0,0,0,0.8); }
                .glitch { animation: glitch 1s infinite; }
            `}</style>
            
            <div className="glow-spot"></div>

            <div className="glass-card p-10 max-w-lg w-full relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>
                <h1 className="text-5xl font-bold mb-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-[Rajdhani]">SYSTEM OFFLINE</h1>
                
                <div className="flex items-center gap-2 text-pink-500 font-mono text-sm mb-8">
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                    MAINTENANCE PROTOCOLS ACTIVE
                </div>

                <p className="text-gray-300 mb-8 leading-relaxed">
                    The Astra IETM network is currently undergoing critical infrastructure upgrades. 
                    <br/><br/>
                    <span className="text-gray-500 text-sm">Admins may still access the secure console via direct link.</span>
                </p>

                <div className="w-full h-1 bg-white/10 overflow-hidden mb-6">
                    <div className="h-full bg-cyan-400 w-1/3 animate-[translateX_2s_infinite_linear]"></div>
                </div>

                <div className="font-mono text-xs text-gray-500 h-16">
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1"><span className="text-green-500 mr-2">&gt;</span>{log}</div>
                    ))}
                </div>
            </div>
            
             <a href="/admin" className="absolute bottom-10 text-gray-700 hover:text-white text-xs uppercase tracking-widest transition-colors">
                Admin Access
            </a>
        </div>
    );
};

export default Maintenance;
