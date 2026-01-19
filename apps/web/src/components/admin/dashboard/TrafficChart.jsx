import React, { useMemo } from 'react';

// Helper to generate smooth SVG path
const generateSmoothPath = (points, width, height) => {
    if (!points || points.length < 2) return "";
    
    // Normalize points to fit width/height
    const maxVal = Math.max(...points, 1);
    const stepX = width / (points.length - 1);
    
    // Invert Y because SVG 0 is top
    const coordinates = points.map((p, i) => [
        i * stepX,
        height - (p / maxVal) * height * 0.8 // Utilize 80% height to leave headroom
    ]);

    let d = `M ${coordinates[0][0]},${coordinates[0][1]}`;

    for (let i = 0; i < coordinates.length - 1; i++) {
        const [x0, y0] = coordinates[Math.max(i - 1, 0)];
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[i + 1];
        const [x3, y3] = coordinates[Math.min(i + 2, coordinates.length - 1)];

        const cp1x = x1 + (x2 - x0) / 6;
        const cp1y = y1 + (y2 - y0) / 6;

        const cp2x = x2 - (x3 - x1) / 6;
        const cp2y = y2 - (y3 - y1) / 6;

        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }

    return d;
};

const TrafficChart = ({ data, labels, isLoading }) => {
    // Memoize path calculations
    const { pathData, fillPath } = useMemo(() => {
        if (!data || data.length === 0) return { pathData: "", fillPath: "" };
        const path = generateSmoothPath(data, 1000, 300);
        return {
            pathData: path,
            fillPath: path ? `${path} L 1000,400 L 0,400 Z` : ""
        };
    }, [data]);

    const isRising = data && data.length >= 2 && data[data.length-1] >= data[data.length-2];

    if (isLoading) {
        return (
            <div className="lg:col-span-3 bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 h-[400px] animate-pulse flex items-center justify-center">
                 <div className="text-gray-600 font-mono text-xs">LOADING_TELEMETRY...</div>
            </div>
        );
    }

    // Determine Y-axis max for scaling bars
    const maxVal = Math.max(...(data || []), 1);

    return (
        <div className="lg:col-span-3 bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 relative overflow-hidden">
            {/* Header */}
            <div className="relative z-20 flex justify-between items-start">
                <div>
                    <p className="text-white font-bold text-lg mb-1 font-orbitron tracking-wide">Registration Traffic</p>
                    <div className="flex items-center gap-2 mb-6">
                        <span className={`font-bold text-sm ${isRising ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {isRising ? '▲ Trending Up' : '▼ Stabilizing'}
                        </span>
                        <span className="text-gray-500 text-xs uppercase tracking-wider">vs last 6 months</span>
                    </div>
                </div>
                
                {/* Stats Summary */}
                <div className="text-right">
                    <p className="text-2xl font-bold text-white font-mono">{data.reduce((a,b) => a+b, 0)}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Total Period</p>
                </div>
            </div>

            <div className="h-64 mt-4 relative w-full">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-b border-white/20 w-full h-0"></div>
                    <div className="border-b border-white/20 w-full h-0"></div>
                    <div className="border-b border-white/20 w-full h-0"></div>
                    <div className="border-b border-white/20 w-full h-0"></div>
                </div>

                {/* Bars + Tooltips */}
                <div className="absolute inset-0 flex items-end justify-between px-4 sm:px-10 gap-4 z-10 w-full">
                        {data.map((val, i) => (
                            <div key={i} className="flex-1 relative group flex flex-col justify-end items-center h-full">
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-[85%] bg-[#0B0F14] border border-white/20 px-3 py-1.5 rounded-lg text-[10px] text-white whitespace-nowrap transition-all pointer-events-none transform translate-y-2 group-hover:translate-y-0 shadow-xl z-30">
                                    <span className="font-bold text-primary">{val}</span> Registrations
                                    <div className="text-gray-500 text-[9px] mt-0.5">{labels[i]}</div>
                                </div>

                                {/* Bar Container */}
                                <div className="w-full max-w-[40px] bg-gradient-to-t from-vision-primary/5 to-transparent rounded-t-lg relative overflow-hidden h-full flex items-end transition-all duration-300 group-hover:bg-white/5"> 
                                    {/* The Actual Bar */}
                                    <div 
                                        className="w-full bg-vision-primary/30 group-hover:bg-vision-primary transition-colors duration-300 rounded-t-[2px] relative"
                                        style={{ height: `${(val / maxVal) * 80}%` }}
                                    >
                                        {/* Top Glow Line */}
                                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-vision-primary shadow-[0_0_10px_#22d3ee]"></div>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-500 mt-3 font-mono border-t border-transparent group-hover:border-vision-primary/50 group-hover:text-vision-primary transition-all pt-1">
                                    {labels[i]}
                                </span>
                            </div>
                        ))}
                </div>

                {/* Smooth Curve Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 1000 350" preserveAspectRatio="none"> 
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.15"/>
                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
                        </linearGradient>
                         <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <path 
                        d={fillPath} 
                        fill="url(#chartGradient)" 
                        opacity="0.6"
                    />
                    <path 
                        d={pathData} 
                        stroke="#6366F1" 
                        strokeWidth="3" 
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        filter="url(#neonGlow)"
                        className="drop-shadow-lg"
                    />
                </svg>
            </div>
        </div>
    );
};

export default TrafficChart;
