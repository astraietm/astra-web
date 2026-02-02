import React, { useState, useEffect } from 'react';
import { Shield, Brain, Lightbulb, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import eventsData from '../../data/events';

// Static config for styling (cycling colors/icons)
const STYLE_CONFIG = [
  { icon: Shield, color: "bg-cyan-500", text: "text-cyan-500", shadow: "shadow-cyan-500/20" },
  { icon: Brain, color: "bg-purple-500", text: "text-purple-500", shadow: "shadow-purple-500/20" },
  { icon: Lightbulb, color: "bg-yellow-500", text: "text-yellow-500", shadow: "shadow-yellow-500/20" },
  { icon: Box, color: "bg-emerald-500", text: "text-emerald-500", shadow: "shadow-emerald-500/20" },
];

export function EventTracks() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEvents = async () => {
        const CACHE_KEY = 'astra_events_v2';
        let hasCachedData = false;

        // 1. Try Cache
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setEvents(parsed.slice(0, 4));
                    setLoading(false);
                    hasCachedData = true;
                }
            }
        } catch (e) {
            console.warn("EventTracks cache invalid", e);
        }

        // 2. Fetch Fresh
        try {
            const response = await axios.get(`${API_URL}/events/`);
            
            // Map to standardize structure (consistent with Events.jsx)
            const apiEvents = response.data.map(event => ({
                ...event,
                date: event.event_date,
                image: event.image || null
            }));

            // Merge with local events
            const apiIds = new Set(apiEvents.map(e => e.id));
            const localEvents = eventsData.filter(e => !apiIds.has(e.id));
            const allEvents = [...apiEvents, ...localEvents];
            
            // Sort by date descending
            allEvents.sort((a, b) => new Date(b.date || b.event_date) - new Date(a.date || a.event_date));

            setEvents(allEvents.slice(0, 4));
            
            // Update shared cache
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(allEvents));

        } catch (error) {
            console.error("Failed to fetch events for tracks:", error);
            // Fallback to local eventsData if no cache
            if (!hasCachedData) {
                setEvents(eventsData.slice(0, 4));
            }
        } finally {
            setLoading(false);
        }
    };

    fetchEvents();
  }, [API_URL]);

  return (
    <section className="bg-black py-24 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header - Magnathon Style */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
        >
            <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter opacity-90">
                EVENTS<span className="text-white/20">/</span>
            </h2>
        </motion.div>

        {/* Tracks/Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => {
             // Cyclically assign styles
             const style = STYLE_CONFIG[index % STYLE_CONFIG.length];
             const formattedId = (index + 1).toString().padStart(2, '0');

             return (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  className="group relative h-[450px] bg-[#0A0A0A] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col justify-between p-8 hover:border-white/20 transition-colors duration-500"
                >
                    {/* Background Number */}
                    <div className="absolute top-4 right-6 text-8xl font-bold text-white/[0.03] select-none font-mono transition-transform duration-500 group-hover:scale-110">
                        {formattedId}
                    </div>

                    {/* Center Icon/Visual */}
                    <div className="flex-1 flex items-center justify-center relative z-10">
                        <div className={`relative w-32 h-32 rounded-3xl flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 group-hover:scale-105 transition-transform duration-500 ${style.shadow} shadow-2xl group-hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)]`}>
                            <style.icon className={`w-16 h-16 ${style.text} transition-all duration-300 drop-shadow-md`} />
                             {/* Fake Inner Glow */}
                            <div className={`absolute inset-0 ${style.color} opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-opacity duration-500`} />
                        </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="relative z-10 mt-auto">
                        {/* Accent Line - Expands on Hover */}
                        <div className="w-12 h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
                            <motion.div 
                                className={`h-full ${style.color} w-0 group-hover:w-full transition-all duration-500 ease-out`}
                            />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white uppercase leading-tight tracking-wider mb-2 group-hover:text-white transition-colors duration-300">
                            {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium group-hover:text-gray-400 transition-colors duration-300">
                            {event.category || event.desc || "Event"}
                        </p>
                    </div>

                    {/* Subtle Hover Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-${style.color.replace('bg-', '')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                </motion.div>
             );
          })}
        </div>
      </div>
    </section>
  );
}
