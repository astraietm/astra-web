import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const useCountUp = (value) => {
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));
    
    useEffect(() => {
        const controls = animate(motionValue, typeof value === 'number' ? value : parseFloat(value) || 0, {
            duration: 1.2,
            ease: "easeOut",
        });
        return controls.stop;
    }, [value]);

    return rounded;
};

const KPICard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    description,
    isPrimary = false, 
    isLoading = false 
}) => {
    const isNumber = typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)));
    const numericValue = isNumber ? (typeof value === 'number' ? value : parseFloat(value)) : 0;
    const animatedNumber = useCountUp(numericValue);
    const displayValue = isNumber ? animatedNumber : value;

    if (isLoading) {
        return (
            <div className="p-5 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-3 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="h-3 w-24 bg-white/[0.06] rounded" />
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06]" />
                </div>
                <div className="h-8 w-20 bg-white/[0.08] rounded" />
                <div className="h-3 w-32 bg-white/[0.04] rounded" />
            </div>
        );
    }

    return (
        <div 
            className={`
                p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden group
                ${isPrimary 
                    ? 'bg-[#111625] border-blue-500/30 shadow-sm' 
                    : 'bg-[#111319] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#151822] shadow-sm'}
            `}
        >
            <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {title}
                </span>
                <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${isPrimary 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] group-hover:text-white group-hover:bg-white/[0.06]'}
                `}>
                    <Icon size={18} />
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-bold tracking-tight text-white tabular-nums">
                        {isNumber ? <motion.span>{displayValue}</motion.span> : value}
                        {typeof value === 'string' && value.includes('%') && '%'}
                    </span>
                    {trend && trendValue && (
                        <div className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            trend === 'up' 
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                                : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        }`}>
                            {trend === 'up' ? <ArrowUpRight size={11} className="mr-0.5" /> : <ArrowDownRight size={11} className="mr-0.5" />}
                            {trendValue}
                        </div>
                    )}
                </div>

                {description && (
                    <p className="text-[11px] text-slate-400 font-medium">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default KPICard;
