import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Terminal, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import EventHero from '../components/events/EventHero';
import EventModule from '../components/events/EventModule';
import SkeletonLoader from '../components/common/SkeletonLoader';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/`);
        const mappedEvents = response.data.map(event => ({
          ...event,
          date: event.event_date,
          image: event.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070'
        }));
        
        // Sort by date (newest first)
        mappedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(mappedEvents);

      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#05080f] min-h-screen text-gray-200 font-sans selection:bg-primary/30 relative overflow-hidden">
      
      {/* Global Cyber Effects */}
      {/* Scanline Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.02] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />
      
      {/* Hex Pattern Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03]" 
           style={{
               backgroundImage: `radial-gradient(circle, rgba(99, 102, 241, 0.4) 1px, transparent 1px)`,
               backgroundSize: '50px 50px',
           }} 
      />

      {/* Animated Network Nodes */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Radial Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Hero */}
      <EventHero />

      {/* Events Feed */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 min-h-[50vh]">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-white font-display uppercase tracking-tight">
              Active Operations
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
          </div>
          <p className="text-sm text-gray-500 font-mono">
            <span className="text-green-400">&gt;</span> Displaying {events.length} classified mission{events.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
             <div className="flex flex-col gap-8">
                {[1, 2, 3].map((i) => (
                  <SkeletonLoader key={i} variant="card" />
                ))}
             </div>
        ) : (
            <div className="flex flex-col gap-8">
                <AnimatePresence mode='wait'>
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <EventModule key={event.id} event={event} index={index} />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center border-2 border-dashed border-primary/20 rounded bg-white/[0.01] relative overflow-hidden"
                        >
                            <Terminal className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                            <p className="text-gray-500 font-mono text-sm">
                              [NO_ACTIVE_OPERATIONS_DETECTED]
                            </p>
                            <p className="text-gray-600 font-mono text-xs mt-2">
                              System status: Standby
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )}
      </div>

    </div>
  );
};

export default Events;
