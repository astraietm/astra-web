

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Filter, ChevronRight, ChevronLeft, Shield, Zap, Terminal, Globe } from 'lucide-react';

import axios from 'axios';

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'workshops', label: 'Workshops', icon: Terminal },
  { id: 'ctf', label: 'CTF', icon: Shield },
  { id: 'seminars', label: 'Seminars', icon: Globe },
  { id: 'hackathons', label: 'Hackathons', icon: Zap },
];

const GalleryGrid = () => {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/gallery/`);
        // Map backend response to match gallery item structure if needed
        const mappedItems = response.data.map(item => ({
            id: item.id,
            src: item.image_url,
            category: item.category,
            title: item.title,
            size: 'normal' // Default size, can be randomized or stored in DB
        }));
        setItems(mappedItems);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        setLoading(false);
    }
  };

  // Filter logic
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  if (loading) {
      return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
              {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-60 bg-white/5 rounded-2xl border border-white/10"></div>
              ))}
          </div>
      );
  }

  if (items.length === 0) {
      return (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
              <p className="text-gray-400 font-mono">NO_DATA_FOUND // ARCHIVE_EMPTY</p>
          </div>
      );
  }

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex]);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((cat) => (
            <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`
                px-6 py-2 rounded-full font-mono text-sm tracking-wider uppercase border transition-all duration-300 flex items-center gap-2
                ${filter === cat.id 
                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(0,224,255,0.3)]' 
                : 'bg-surface/50 border-white/10 text-gray-400 hover:border-primary/50 hover:text-white'}
            `}
            >
            {cat.icon && <cat.icon className="w-4 h-4" />}
            {cat.label}
            </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <motion.div 
        layout 
        className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-surface border border-white/5 cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
                {/* Image */}
                <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Cyber Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-primary text-xs font-mono uppercase tracking-[0.2em] mb-2 block">
                            ASTRA | {categories.find(c => c.id === item.category)?.label}
                        </span>
                        <h3 className="text-white font-display font-bold text-xl">{item.title}</h3>
                    </div>
                    
                    {/* Expand Icon */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                        <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Border Glow Effect */}
                <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/50 transition-colors duration-300 rounded-2xl pointer-events-none"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button 
                className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-50 group"
                onClick={() => setSelectedImage(null)}
            >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Navigation Buttons */}
            <button 
                className="absolute left-4 md:left-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-40 hidden md:block"
                onClick={handlePrev}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
                className="absolute right-4 md:right-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-40 hidden md:block"
                onClick={handleNext}
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main Image Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="relative max-w-7xl max-h-[90vh] w-full bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    className="w-full h-full max-h-[85vh] object-contain bg-black/50"
                />
                
                {/* Details Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 p-6 flex justify-between items-center">
                    <div>
                        <span className="text-primary text-xs font-mono uppercase tracking-widest mb-1 block">
                            Event Record #{selectedImage.id.toString().padStart(4, '0')}
                        </span>
                        <h2 className="text-white font-display font-bold text-2xl">{selectedImage.title}</h2>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm font-mono">
                        <Globe className="w-4 h-4" />
                        <span>ASTRA.SECURE.NET</span>
                    </div>
                </div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
