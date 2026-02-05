import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowUpRight, Clock, ShieldCheck, Terminal, MapPin, Zap } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/helpers';

const EventModule = ({ event, index }) => {
    const navigate = useNavigate();
    const isCompleted = new Date(event.date) < new Date();
    const isHawkins = event.title?.toLowerCase().includes('hawkins');
    const premiumImage = 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800';

    // Force premium image for Hawkins to fix the "buggy image" issue
    const rawImage = isHawkins ? premiumImage : (event.image || premiumImage);

    const displayImage = getOptimizedImageUrl(rawImage, 'grid');

    const accentColor = isHawkins ? 'red' : 'blue';
    const accentHex = isHawkins ? '#ef4444' : '#3b82f6';

    // Force Hawkins Lab Checks
    // if (isHawkins) {
    //      // Override status for Hawkins Lab
    //      event.is_registration_open = false; 
    // }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            onClick={() => !isHawkins && navigate(`/events/${event.id}`)}
            className={`group relative w-full h-[450px] sm:h-[530px] rounded-[2.5rem] overflow-hidden bg-[#050505] border border-white/5 ${!isHawkins ? 'cursor-pointer' : 'cursor-default'} flex flex-col transition-all duration-500 hover:border-${accentColor}-500/30 hover:shadow-[0_20px_50px_-15px_rgba(${isHawkins ? '239,68,68' : '59,130,246'},0.15)]`}
        >
            {/* Visual Container */}
            <div className="relative h-[55%] w-full overflow-hidden">
                {/* Image with zoom effect */}
                <img
                    src={displayImage}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                />

                {/* Sophisticated Gradient Mask */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent`} />

                {/* Scanner/Glitch Effect for Hawkins */}
                {isHawkins && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/10 to-transparent h-1 w-full animate-scan pointer-events-none" />
                )}

                {/* Floating Meta Tag */}
                <div className="absolute top-6 left-6 z-20">
                    <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-gray-500' :
                            !event.is_registration_open ? 'bg-amber-400' : 
                                `bg-${accentColor}-500 shadow-[0_0_8px_${accentHex}] animate-pulse`
                            }`} />
                        <span className="text-[10px] font-black tracking-widest uppercase text-white/80">
                            {isCompleted ? 'Archived' : !event.is_registration_open ? 'Coming Soon' : 'Active Access'}
                        </span>
                    </div>
                </div>

                {/* Date Badge Overlay */}
                <div className="absolute bottom-6 right-6 z-20">
                    <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-white text-black shadow-2xl transition-transform duration-500 group-hover:-translate-y-2`}>
                        <span className="text-xs font-black leading-none uppercase">{isHawkins ? 'FEB' : new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                        <span className="text-xl font-bold leading-none mt-1">{isHawkins ? '12' : new Date(event.date).getDate()}</span>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="relative flex-1 p-8 pt-4 flex flex-col justify-between">
                <div>
                    {/* Category & Status */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-${accentColor}-400`}>
                            {event.category || 'Classified'}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                            <Clock className={`w-3 h-3 text-${accentColor}-500`} />
                            {event.time || '10:00 AM'}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight tracking-tight group-hover:text-${accentColor}-400 transition-colors duration-300 line-clamp-2`}>
                        {event.title}
                    </h3>

                    {/* Description - Clamped */}
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {event.description || "System authentication required. Encrypted parameters detected."}
                    </p>
                </div>

                {/* Bottom Row */}
                <div className="pt-6 flex items-center justify-between border-t border-white/5">
                    <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            {isHawkins ? <Zap className="w-3.5 h-3.5 text-red-500" /> : <MapPin className="w-3.5 h-3.5 text-blue-500" />}
                            <span>{event.venue || 'Campus HQ'}</span>
                        </div>
                    </div>

                    <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500`}>
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Subtle bottom accent line */}
            <div className={`absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-${accentColor}-500/0 to-transparent group-hover:via-${accentColor}-500/50 transition-all duration-1000`} />
        </motion.div>
    );
};

export default EventModule;
