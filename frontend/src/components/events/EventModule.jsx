import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const EventModule = ({ event, index }) => {
    const navigate = useNavigate();
    const isCompleted = new Date(event.date) < new Date();
    const isLocked = !event.is_registration_open;
    
    // Calculate registration progress
    const registrationProgress = event.registration_limit 
        ? ((event.registered_count || 0) / event.registration_limit) * 100 
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            onClick={() => navigate(`/events/${event.id}`)}
            className="group relative cursor-pointer"
        >
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0D1117] to-[#0A0F1C] border border-white/10 hover:border-primary/30 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgb(99,102,241,0.12)]">
                
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-6 md:p-8">
                    
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {/* Status Badge */}
                            {isCompleted ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Completed
                                </span>
                            ) : isLocked ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                    <XCircle className="w-3.5 h-3.5" />
                                    Closed
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Open
                                </span>
                            )}

                            {/* Category Badge */}
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                {event.category || 'Workshop'}
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-2">
                        {event.description || event.short_description || "Join us for an exciting cybersecurity event."}
                    </p>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Date</div>
                                <div className="text-sm text-white font-medium">
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <Clock className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Duration</div>
                                <div className="text-sm text-white font-medium">{event.duration || '2-3h'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Venue</div>
                                <div className="text-sm text-white font-medium truncate">{event.venue || 'TBA'}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Capacity</div>
                                <div className="text-sm text-white font-medium">
                                    {event.registered_count || 0}/{event.registration_limit || '∞'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Progress Bar */}
                    {event.registration_limit && (
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">Registration</span>
                                <span className="text-xs text-primary font-medium">{Math.round(registrationProgress)}% filled</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${registrationProgress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-sm text-gray-500">Click to view details</span>
                        <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                            <span className="text-sm font-medium">View Event</span>
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventModule;
