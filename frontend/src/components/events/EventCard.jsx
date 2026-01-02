import React, { useRef, useState } from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event, index }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-surface border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full"
    >
        {/* Spotlight Effect */}
         <div
            className='pointer-events-none absolute -inset-px transition opacity-500 rounded-2xl'
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 255, 157, 0.15), transparent 40%)`,
            }}
        />
        
        {/* Border Highlight */}
        <div
            className='pointer-events-none absolute -inset-px transition opacity-500 rounded-2xl'
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 255, 157, 0.4), transparent 40%)`,
                maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
            }}
        />

        {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent z-10"></div>
        <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col justify-between relative z-20">
        <div>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{event.date}</span>
                </div>
                 <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{event.venue}</span>
                </div>
            </div>
            
            <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight group-hover:text-primary transition-colors">
                {event.title}
            </h3>
            
            <p className="text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                {event.description}
            </p>
        </div>

        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold text-sm tracking-wide uppercase hover:bg-primary hover:text-black hover:border-primary transition-all flex items-center justify-center gap-2 group/btn">
            Register Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default EventCard;
