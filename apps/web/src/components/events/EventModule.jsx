import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowUpRight, Clock, ShieldCheck, Terminal, MapPin, Zap } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/helpers';

const EventModule = ({ event, index }) => {
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const isCompleted = new Date(event.date) < new Date();
    const isHawkins = event.title?.toLowerCase().includes('hawkins');
    const premiumImage = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800';

    // Force premium image for Hawkins to fix the "buggy image" issue
    const rawImage = isHawkins ? premiumImage : (event.image || premiumImage);

    const displayImage = getOptimizedImageUrl(rawImage, 'grid');

    const accentColor = isHawkins ? 'red' : 'blue';
    const accentHex = isHawkins ? '#ef4444' : '#3b82f6';
    
    // ... rest ...

    // In JSX:
    // src={imgError ? premiumImage : displayImage}
    // onError={() => setImgError(true)}

    // Force Hawkins Lab Checks
    // if (isHawkins) {
    //      // Override status for Hawkins Lab
    //      event.is_registration_open = false; 
    // }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ delay: index * 0.05, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            onClick={() => navigate(`/events/${event.id}`)}
            className={`group relative w-full h-[400px] xs:h-[450px] sm:h-[530px] rounded-[2rem] overflow-hidden bg-white/[0.02] backdrop-blur-3xl border border-white/10 cursor-pointer flex flex-col transition-all duration-700 hover:border-${accentColor}-500/40 hover:bg-white/[0.04] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] will-change-transform`}
        >
            {/* Visual Container */}
            <div className="relative h-[50%] xs:h-[55%] w-full overflow-hidden shrink-0">
                {/* Image with zoom effect */}
                <img
                    src={imgError ? premiumImage : displayImage}
                    onError={() => setImgError(true)}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 opacity-60 group-hover:opacity-100 will-change-transform"
                    loading="lazy"
                />

                {/* Sophisticated Gradient Mask */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent`} />

                {/* Scanner/Glitch Effect for Hawkins */}
                {isHawkins && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent h-[2px] w-full animate-scan pointer-events-none" />
                )}

                {/* Floating Meta Tag */}
                <div className="absolute top-5 left-5 md:top-6 md:left-6 z-20">
                    <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-gray-500' :
                            !event.is_registration_open ? 'bg-amber-400' : 
                                `bg-${accentColor}-500 shadow-[0_0_10px_rgba(${isHawkins ? '239,68,68' : '59,130,246'},0.8)] animate-pulse`
                            }`} />
                        <span className="text-[10px] font-bold tracking-wider text-white/90">
                            {isCompleted ? 'Archived' : !event.is_registration_open ? 'Coming Soon' : 'Registration Open'}
                        </span>
                    </div>
                </div>

                {/* Date Badge Overlay */}
                <div className="absolute bottom-5 right-5 md:bottom-6 md:right-6 z-20">
                    <div className={`flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white text-black shadow-2xl transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-cyan-500/20`}>
                        <span className="text-[10px] font-black leading-none uppercase">{isHawkins ? 'FEB' : new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                        <span className="text-xl md:text-2xl font-black leading-none mt-1">{isHawkins ? '12' : new Date(event.date).getDate()}</span>
                    </div>
                </div>
            </div>

            {/* Content Container - Glassy Overlay */}
            <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-[#020202] to-black">
                <div className="min-w-0">
                    {/* Category & Status */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2.5 py-1 rounded-lg bg-${accentColor}-500/10 border border-${accentColor}-500/20 text-[10px] font-medium tracking-wide text-${accentColor}-400`}>
                            {event.category || 'Event'}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium tracking-wide">
                            <Clock size={12} className="text-slate-700" />
                            {event.time || '10:00 AM'}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-cyan-400 transition-colors duration-500 truncate">
                        {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-2 md:line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                        {event.description || "System authentication required. Encrypted parameters detected."}
                    </p>
                </div>

                {/* Live Slot Tracker */}
                {(event.max_participation > 0 || event.registration_limit > 0) && (
                    <div className="mt-4 mb-2">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-medium tracking-wide text-slate-500">Live Capacity</span>
                            <span className={`text-[10px] font-medium tracking-wide ${
                                (event.registration_count || 0) >= (event.max_participation || event.registration_limit) 
                                ? 'text-red-500' 
                                : 'text-cyan-400'
                            }`}>
                                {(event.max_participation || event.registration_limit) - (event.registration_count || 0)} Slots Left
                            </span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.min(100, ((event.registration_count || 0) / (event.max_participation || event.registration_limit)) * 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                    ((event.registration_count || 0) / (event.max_participation || event.registration_limit)) > 0.9 
                                    ? 'bg-red-500' 
                                    : 'bg-cyan-500'
                                }`} 
                            />
                        </div>
                    </div>
                )}

                {/* Bottom Row */}
                <div className="pt-4 flex items-center justify-between border-t border-white/[0.05]">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500 tracking-wide group-hover:text-white transition-colors duration-500 truncate pr-4">
                        {isHawkins ? <Zap size={14} className="text-red-500" /> : <MapPin size={14} className="text-blue-500" />}
                        <span className="truncate">{event.venue || 'TBA'}</span>
                    </div>

                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:scale-110 transition-all duration-700 shrink-0`}>
                        <ArrowUpRight size={20} className="transition-transform duration-700 group-hover:rotate-45" />
                    </div>
                </div>
            </div>

            {/* Subtle bottom accent line */}
            <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-${accentColor}-500/0 to-transparent group-hover:via-cyan-500/50 transition-all duration-1000`} />
        </motion.div>

    );
};

export default EventModule;
