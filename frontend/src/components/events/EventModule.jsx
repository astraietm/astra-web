import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Shield, Terminal, Lock, Unlock, ArrowRight, Zap } from 'lucide-react';

const EventModule = ({ event, index }) => {
    const navigate = useNavigate();
    const [isDecrypted, setIsDecrypted] = useState(false);
    const isCompleted = new Date(event.date) < new Date();
    const isLocked = !event.is_registration_open;
    
    // Generate hex ID
    const hexId = `0x${(event.id * 1000 + index).toString(16).toUpperCase().padStart(4, '0')}`;
    
    // Calculate registration progress
    const registrationProgress = event.registration_limit 
        ? ((event.registered_count || 0) / event.registration_limit) * 100 
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative w-full"
            onMouseEnter={() => setIsDecrypted(true)}
            onMouseLeave={() => setIsDecrypted(false)}
        >
            {/* Tactical Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0F141F] to-[#0A0F1C] border border-white/10 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]">
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/50 transition-all group-hover:w-8 group-hover:h-8" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/50 transition-all group-hover:w-8 group-hover:h-8" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/50 transition-all group-hover:w-8 group-hover:h-8" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/50 transition-all group-hover:w-8 group-hover:h-8" />

                {/* Scan Line Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-scan" />
                </div>

                {/* Top Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Main Content */}
                <div className="relative p-6 md:p-8">
                    
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Status LED */}
                            <div className="flex items-center gap-2">
                                {isCompleted ? (
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-[9px] font-mono font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase tracking-wider">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                        COMPLETED
                                    </span>
                                ) : isLocked ? (
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-[9px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-wider">
                                        <Lock className="w-3 h-3" />
                                        LOCKED
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-[9px] font-mono font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase tracking-wider">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        ACTIVE
                                    </span>
                                )}
                            </div>

                            {/* Category Badge */}
                            <span className="px-2 py-1 rounded-sm text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                                {event.category || 'CTF'}
                            </span>
                        </div>

                        {/* Hex ID */}
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3 h-3 text-gray-600" />
                            <span className="text-[10px] font-mono text-gray-600">{hexId}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors font-display uppercase tracking-tight">
                        {isDecrypted ? event.title : (
                            <span className="blur-sm group-hover:blur-none transition-all duration-300">
                                {event.title}
                            </span>
                        )}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed max-w-3xl mb-6 border-l-2 border-primary/30 pl-4">
                        {isDecrypted ? (
                            event.description || event.short_description || "Classified operation details. Full briefing available upon registration."
                        ) : (
                            <span className="blur-sm group-hover:blur-none transition-all duration-300">
                                {event.description || event.short_description || "Classified operation details. Full briefing available upon registration."}
                            </span>
                        )}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div>
                                <div className="text-[9px] text-gray-600 font-mono uppercase">Date</div>
                                <div className="text-xs text-white font-mono">
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded">
                            <Clock className="w-4 h-4 text-primary" />
                            <div>
                                <div className="text-[9px] text-gray-600 font-mono uppercase">Duration</div>
                                <div className="text-xs text-white font-mono">{event.duration || '2H'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded">
                            <MapPin className="w-4 h-4 text-primary" />
                            <div>
                                <div className="text-[9px] text-gray-600 font-mono uppercase">Venue</div>
                                <div className="text-xs text-white font-mono truncate">{event.venue || 'TBA'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded">
                            <Users className="w-4 h-4 text-primary" />
                            <div>
                                <div className="text-[9px] text-gray-600 font-mono uppercase">Slots</div>
                                <div className="text-xs text-white font-mono">
                                    {event.registered_count || 0}/{event.registration_limit || '∞'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Progress Bar */}
                    {event.registration_limit && (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-mono text-gray-500 uppercase">Registration Capacity</span>
                                <span className="text-[9px] font-mono text-primary">{Math.round(registrationProgress)}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-primary to-cyan-400"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${registrationProgress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="group/btn relative overflow-hidden px-6 py-3 bg-primary text-black font-bold rounded transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <Shield className="w-4 h-4" />
                            <span className="relative z-10">[VIEW_DETAILS]</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                        </button>
                        <button className="px-6 py-3 bg-white/5 text-white font-bold rounded border border-white/20 hover:bg-white/10 transition-all font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                            <Zap className="w-4 h-4" />
                            <span>&gt; quick_register</span>
                        </button>
                    </div>
                </div>

                {/* Particle Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-scan {
                    animation: scan 3s ease-in-out infinite;
                }
            `}</style>
        </motion.div>
    );
};

export default EventModule;
