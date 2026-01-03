import React, { useState, useEffect } from 'react';

const SystemMonitor = () => {
    const [stats, setStats] = useState({
        cpu: 12,
        mem: 45,
        net: '1.2kb/s',
        uptime: '00:00:00'
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                cpu: Math.floor(Math.random() * 30) + 10,
                mem: Math.floor(Math.random() * 20) + 40,
                net: `${(Math.random() * 5).toFixed(1)}kb/s`,
                uptime: new Date().toISOString().split('T')[1].split('.')[0]
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed bottom-8 right-8 z-40 hidden md:block font-mono text-xs text-primary/70 pointer-events-none bg-black/80 p-4 border border-primary/20 backdrop-blur-md rounded-lg shadow-lg">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-8 border-b border-primary/20 pb-1">
                    <span className="text-gray-500">SYSTEM.STATUS</span>
                    <span className="text-primary animate-pulse">ONLINE</span>
                </div>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400">CPU_LOAD</span>
                    <span>{stats.cpu}%</span>
                </div>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400">MEM_ALLOC</span>
                    <span>{stats.mem}%</span>
                </div>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400">NET_IO</span>
                    <span>{stats.net}</span>
                </div>
                <div className="flex justify-between gap-8">
                    <span className="text-gray-400">SESSION</span>
                    <span>{stats.uptime}</span>
                </div>
            </div>
             {/* Decorative Scanline */}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[5px] w-full animate-scan opacity-30"></div>
        </div>
    );
};

export default SystemMonitor;
