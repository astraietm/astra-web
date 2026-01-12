import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import EventHero from '../components/events/EventHero';
import EventTimeline from '../components/events/EventTimeline';
import EventModule from '../components/events/EventModule';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2026'); // Default to current/upcoming

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/`);
        // Map backend fields to frontend props
        const mappedEvents = response.data.map(event => ({
          ...event,
          date: event.event_date,
          image: event.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070'
        }));
        
        setEvents(mappedEvents);
        
        // Auto-select year if 2026 is empty but others exist
        const has2026 = mappedEvents.some(e => new Date(e.date).getFullYear().toString() === '2026');
        if (!has2026 && mappedEvents.length > 0) {
            // Find the most recent event's year
            const years = mappedEvents.map(e => new Date(e.date).getFullYear());
            const maxYear = Math.max(...years).toString();
            setSelectedYear(maxYear);
        }

      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events by year
  const filteredEvents = events.filter(event => {
      const eventYear = new Date(event.date).getFullYear().toString();
      return eventYear === selectedYear;
  });

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-gray-200 font-sans selection:bg-blue-500/30">
      
      {/* 1. Cinematic Hero */}
      <EventHero />

      {/* 2. Timeline Navigation */}
      <EventTimeline selectedYear={selectedYear} onYearChange={setSelectedYear} />

      {/* 3. Events Feed */}
      <div className="max-w-5xl mx-auto px-4 py-20 min-h-[50vh]">
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                <span className="text-xs tracking-widest uppercase">Loading Modules...</span>
             </div>
        ) : (
            <div className="flex flex-col gap-6">
                <AnimatePresence mode='wait'>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <EventModule key={event.id} event={event} index={index} />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center border border-white/5 rounded-2xl bg-white/[0.01]"
                        >
                            <p className="text-gray-500 font-light text-lg">No signals detected for {selectedYear}.</p>
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
