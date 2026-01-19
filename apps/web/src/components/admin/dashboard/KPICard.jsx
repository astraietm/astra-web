import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const useCountUp = (value) => {
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));
    
    useEffect(() => {
        const controls = animate(motionValue, typeof value === 'number' ? value : parseFloat(value) || 0, {
            duration: 1.5,
            ease: "easeOut",
        });
        return controls.stop;
    }, [value]);

    return rounded;
};

const KPICard = ({ title, value, icon: Icon, trend, trendValue, isPrimary = false, isLoading = false }) => {
    // Determine number vs string for animation
    const isNumber = typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)));
    const numericValue = isNumber ? (typeof value === 'number' ? value : parseFloat(value)) : 0;
    
    // We only animate if it's a number.
    const displayValue = isNumber ? useCountUp(numericValue) : value;

    if (isLoading) {
        return (
            <div className="backdrop-blur-xl border border-white/5 bg-white/[0.02] p-5 rounded-[20px] flex justify-between items-center h-[116px] animate-pulse">
                <div className="space-y-3 w-full">
                    <div className="h-3 w-24 bg-white/10 rounded" />
                    <div className="h-8 w-16 bg-white/10 rounded" />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-xl" />
            </div>
        );
    }

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className={`
                backdrop-blur-xl border p-5 rounded-[20px] flex justify-between items-center relative overflow-hidden group transition-all duration-300
                ${isPrimary 
                    ? 'bg-gradient-to-b from-[#1a1f2b] to-[#11151c] border-white/10 shadow-2xl shadow-vision-primary/10' 
                    : 'bg-[#0A0D14]/80 border-white/5 shadow-lg hover:border-white/10'}
            `}
        >
             {/* Hover Glow Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                ${isPrimary 
                    ? 'bg-gradient-to-tr from-vision-primary/10 to-transparent' 
                    : 'bg-gradient-to-tr from-white/5 to-transparent'}
            `} />

            {/* Content */}
            <div className="flex flex-col gap-1 z-10">
                <span className="text-xs font-medium text-gray-500 font-inter tracking-wide uppercase">{title}</span>
                <div className="flex items-baseline gap-2">
                    <span className={`text-2xl font-bold font-inter tracking-tight ${isPrimary ? 'text-white' : 'text-gray-100'}`}>
                        {isNumber ? <motion.span>{displayValue}</motion.span> : value}
                        {typeof value === 'string' && value.includes('%') && '%'}
                    </span>
                    {trend && (
                        <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                            {trend === 'up' ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                            {trendValue}
                        </div>
                    )}
                </div>
            </div>

            {/* Icon */}
            <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300
                ${isPrimary 
                    ? 'bg-vision-primary shadow-blue-500/20 text-white' 
                    : 'bg-white/5 border border-white/5 text-gray-400 group-hover:text-white group-hover:border-white/20 group-hover:bg-white/10'}
            `}>
                <Icon size={20} />
            </div>
            
            {/* Corner Accent for Primary */}
            {isPrimary && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-vision-primary/20 blur-2xl -mr-8 -mt-8 pointer-events-none" />
            )}
        </motion.div>
    );
};

export default KPICard;
