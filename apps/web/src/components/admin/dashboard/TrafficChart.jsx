import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

const generateSmoothPath = (points, width, height) => {
    if (!points || points.length < 2) return "";
    
    const maxVal = Math.max(...points, 1);
    const stepX = width / (points.length - 1);
    
    const coordinates = points.map((p, i) => [
        i * stepX,
        height - (p / maxVal) * (height * 0.72) - 20
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

const TrafficChart = ({ 
    data = [], 
    labels = [], 
    isLoading = false, 
    error = null,
    onRetry,
    timeframe = '7D', 
    onTimeframeChange,
    trend = null, // 'up' | 'down' | null
    trendValue = null // e.g. "+12%" or null
}) => {
    const hasData = useMemo(() => {
        if (!data || data.length === 0) return false;
        // Check if there is at least one non-zero point
        return data.some(val => val > 0);
    }, [data]);

    const { pathData, fillPath } = useMemo(() => {
        if (!hasData) return { pathData: "", fillPath: "" };
        const path = generateSmoothPath(data, 1000, 240);
        return {
            pathData: path,
            fillPath: path ? `${path} L 1000,260 L 0,260 Z` : ""
        };
    }, [data, hasData]);

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="bg-[#111319] border border-white/[0.06] rounded-2xl p-5 sm:p-6 h-[320px] animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <div className="h-4 w-36 bg-white/[0.06] rounded" />
                        <div className="h-3 w-56 bg-white/[0.04] rounded" />
                    </div>
                    <div className="h-7 w-28 bg-white/[0.06] rounded-lg" />
                </div>
                <div className="h-36 bg-white/[0.02] rounded-xl border border-white/[0.04]" />
                <div className="h-3 w-full bg-white/[0.04] rounded" />
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div className="bg-[#111319] border border-white/[0.06] rounded-2xl p-5 sm:p-6 h-[320px] flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h4 className="text-xs font-semibold text-white">Unable to load registration trends</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Something went wrong while fetching trend data.</p>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 border border-white/[0.08] transition-colors"
                    >
                        <RefreshCw size={12} />
                        <span>Retry</span>
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[#111319] border border-white/[0.06] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm min-h-[320px]">
            {/* Header with Title and Range Picker */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white tracking-tight">Registration Trends</h3>
                        {/* Only show real calculated trend when valid */}
                        {trend && trendValue && (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                trend === 'up' 
                                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                            }`}>
                                {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                {trendValue}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Daily attendee sign-ups across all festival tracks</p>
                </div>

                {onTimeframeChange && (
                    <div className="flex items-center bg-[#090A0F] border border-white/[0.06] p-0.5 rounded-lg self-start sm:self-auto">
                        {['24H', '7D', '30D'].map((tf) => (
                            <button
                                key={tf}
                                onClick={() => onTimeframeChange(tf)}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                                    timeframe === tf 
                                        ? 'bg-blue-600 text-white shadow-sm' 
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. Empty State (when 0 registrations exist) */}
            {!hasData ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-center p-4 border border-dashed border-white/[0.06] rounded-xl bg-white/[0.01]">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-500 flex items-center justify-center mb-2.5">
                        <Calendar size={18} />
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200">No registration activity yet</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-xs leading-relaxed">
                        Registration trends will appear here once attendees start registering.
                    </p>
                </div>
            ) : (
                /* 4. Real Data SVG Chart */
                <>
                    <div className="relative w-full h-[180px] select-none my-auto">
                        <svg viewBox="0 0 1000 260" className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="saasBlueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {/* Subtle Grid Lines */}
                            {[40, 100, 160, 220].map((y) => (
                                <line 
                                    key={y} 
                                    x1="0" 
                                    y1={y} 
                                    x2="1000" 
                                    y2={y} 
                                    stroke="rgba(255,255,255,0.03)" 
                                    strokeDasharray="4 4" 
                                />
                            ))}

                            {/* Gradient Fill */}
                            {fillPath && (
                                <path d={fillPath} fill="url(#saasBlueGradient)" />
                            )}

                            {/* Spline Line */}
                            {pathData && (
                                <path 
                                    d={pathData} 
                                    fill="none" 
                                    stroke="#3B82F6" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                />
                            )}
                        </svg>
                    </div>

                    {/* X-Axis Labels */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/[0.04] text-[11px] text-slate-400 font-mono">
                        {labels.map((lbl, idx) => (
                            <span key={idx} className={idx === labels.length - 1 ? "text-blue-400 font-semibold" : ""}>
                                {lbl}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default TrafficChart;
