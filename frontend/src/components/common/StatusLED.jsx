import React from 'react';

const StatusLED = ({ color = 'green', label = 'ONLINE', className }) => {
    const colorMap = {
        green: 'bg-emerald-500 shadow-[0_0_8px_#10b981]',
        amber: 'bg-amber-500 shadow-[0_0_8px_#f59e0b]',
        red: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
        blue: 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]',
        purple: 'bg-purple-500 shadow-[0_0_8px_#a855f7]',
    };

    return (
        <div className={`flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-gray-400 ${className}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-[pulse_2s_infinite] ${colorMap[color] || colorMap.green}`}></span>
            <span className="opacity-70 group-hover:opacity-100 transition-opacity">{label}</span>
        </div>
    );
};

export default StatusLED;
