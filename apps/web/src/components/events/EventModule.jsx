import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import { generateRandomString } from '../ui/evervault-card';

const EventModule = ({ event, index }) => {
    const navigate = useNavigate();
    const isCompleted = new Date(event.date) < new Date();
    
    // Evervault Logic
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);
    const [randomString, setRandomString] = useState("");

    useEffect(() => {
        let str = generateRandomString(1500);
        setRandomString(str);
    }, []);

    function onMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
        const str = generateRandomString(1500);
        setRandomString(str);
    }

    let maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
    let style = { maskImage, WebkitMaskImage: maskImage };
    
    const getStatus = () => {
        if (isCompleted) return { label: 'Past', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
        if (!event.is_registration_open) return { label: 'Closed', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
        return { label: 'Open', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    };
    
    const status = getStatus();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
            onClick={() => navigate(`/events/${event.id}`)}
            onMouseMove={onMouseMove}
            className="group relative cursor-pointer border border-white/[0.1] bg-white/[0.02] flex flex-col items-start p-4 h-[32rem]"
        >
            {/* Corner Icons (The + signs) */}
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white/40 group-hover:text-primary transition-colors duration-500" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white/40 group-hover:text-primary transition-colors duration-500" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white/40 group-hover:text-primary transition-colors duration-500" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white/40 group-hover:text-primary transition-colors duration-500" />

            {/* Pattern Area (The visual core) */}
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-black/40 border border-white/5 mb-6">
                 {/* Evervault Pattern */}
                 <div className="absolute inset-0">
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/30 to-primary/30 opacity-0 group-hover:opacity-100 transition duration-500"
                        style={style}
                    />
                    <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay group-hover:opacity-100"
                        style={style}
                    >
                        <p className="absolute inset-x-0 text-[8px] h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
                            {randomString}
                        </p>
                    </motion.div>
                </div>

                {/* Status Overlay */}
                <div className="absolute top-4 right-4 z-20">
                     <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.color} bg-black/80 backdrop-blur-md uppercase tracking-wider`}>
                        {status.label}
                    </span>
                </div>

                {/* Center Badge */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="relative h-28 w-28 rounded-full flex items-center justify-center text-white font-bold text-center p-2">
                        <div className="absolute w-full h-full bg-black/80 blur-sm rounded-full border border-white/10" />
                        <span className="text-white text-xs font-mono tracking-tighter uppercase relative z-20 group-hover:scale-110 transition-transform">
                            {event.category || 'Access'}<br/>Granted
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Text */}
            <h3 className="text-white text-lg font-bold tracking-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {event.title}
            </h3>
            <p className="text-xs text-gray-500 font-light mb-6 line-clamp-2">
                {event.description || event.short_description || "Neural interface established. Proceed to operation briefing."}
            </p>

            {/* View Button */}
            <div className="mt-auto w-full flex items-center justify-between">
                <div className="text-[10px] font-mono text-gray-400 flex items-center gap-3">
                    <Calendar className="w-3 h-3 text-primary/60" />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-medium text-white group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    Operation Briefing
                </div>
            </div>
        </motion.div>
    );
};


export default EventModule;
