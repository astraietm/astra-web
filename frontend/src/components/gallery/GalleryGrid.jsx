

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, Filter, ChevronRight, ChevronLeft, Shield, Zap, Terminal, Globe, Loader2 } from 'lucide-react';
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
  const [visibleCount, setVisibleCount] = useState(9); // Initial load count

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
        const response = await axios.get(`${API_URL}/gallery/`);
        const mappedItems = response.data.map(item => ({
            id: item.id,
            src: item.image_url,
            category: item.category,
            title: item.title,
        }));
        setItems(mappedItems);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching gallery:', error);
        setLoading(false);
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);

  const visibleItems = filteredItems.slice(0, visibleCount);

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

  if (loading) {
      return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse px-4">
              {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-[4/3] bg-white/5 rounded-2xl border border-white/10"></div>
              ))}
          </div>
      );
  }

  if (items.length === 0) {
      return (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5 mx-4">
              <p className="text-gray-400 font-mono">NO_DATA_FOUND // ARCHIVE_EMPTY</p>
          </div>
      );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Category Filter - Scrollable on mobile */}
      <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 border-b border-white/5 -mx-4 px-4 md:static md:bg-transparent md:border-none md:p-0">
          <div className="flex overflow-x-auto pb-2 md:pb-0 md:flex-wrap md:justify-center gap-3 no-scrollbar snap-x">
            {categories.map((cat) => (
                <button
                key={cat.id}
                onClick={() => { setFilter(cat.id); setVisibleCount(9); }}
                className={`
                    snap-start flex-shrink-0 px-6 py-3 md:py-2 rounded-full font-mono text-sm tracking-wider uppercase border transition-all duration-300 flex items-center gap-2 whitespace-nowrap
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
      </div>

      {/* Gallery Grid */}
      <motion.div 
        layout 
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 px-4 md:px-0"
      >
        <AnimatePresence mode='popLayout'>
          {visibleItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-surface border border-white/5 cursor-pointer transform transition-transform md:hover:-translate-y-1 active:scale-95 duration-200"
              onClick={() => setSelectedImage(item)}
              onContextMenu={(e) => e.preventDefault()}
            >
                {/* Image */}
                <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover"
                />

                {/* Mobile: Simple Gradient / Desktop: Hover Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <div className="transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-2 block">
                            ASTRA // {categories.find(c => c.id === item.category)?.label}
                        </span>
                        <h3 className="text-white font-display font-bold text-lg leading-tight">{item.title}</h3>
                    </div>
                </div>
                
                {/* Watermark (Desktop Hover) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 md:group-hover:opacity-10 transition-opacity duration-500">
                     <span className="text-white/10 font-black text-4xl tracking-widest rotate-[-15deg] uppercase border-4 border-white/10 px-4 py-2">ASTRA</span>
                </div>

                {/* Border Glow Effect */}
                <div className="absolute inset-0 border border-primary/0 md:group-hover:border-primary/50 transition-colors duration-300 rounded-2xl pointer-events-none"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {visibleItems.length < filteredItems.length && (
          <div className="flex justify-center mt-12">
              <button 
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="px-8 py-4 bg-surface border border-white/10 hover:border-primary/50 text-white rounded-xl font-mono uppercase tracking-widest text-sm transition-all hover:bg-white/5 flex items-center gap-3 group"
              >
                  <span>Load More Data</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button 
                className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-white/10 text-white z-50 active:scale-90 transition-transform"
                onClick={() => setSelectedImage(null)}
            >
                <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons (Desktop) */}
            <button 
                className="absolute left-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-40 hidden md:block"
                onClick={handlePrev}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
                className="absolute right-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white transition-colors z-40 hidden md:block"
                onClick={handleNext}
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main Image Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full h-full md:max-w-7xl md:h-auto md:max-h-[90vh] bg-black flex flex-col md:block md:bg-surface md:border md:border-white/10 md:rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
                     {/* Mobile Swipe Indicators (Visual only for now) */}
                     <div className="absolute top-1/2 left-2 text-white/20 md:hidden"><ChevronLeft /></div>
                     <div className="absolute top-1/2 right-2 text-white/20 md:hidden"><ChevronRight /></div>

                    <img
                        src={selectedImage.src}
                        alt={selectedImage.title}
                        className="w-full h-full object-contain md:max-h-[85vh]"
                        onContextMenu={(e) => e.preventDefault()} 
                    />
                </div>
                
                {/* Details Bar */}
                <div className="bg-black/80 backdrop-blur-md border-t border-white/10 p-6 pb-12 md:pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 absolute bottom-0 w-full md:relative">
                    <div>
                        <span className="text-primary text-xs font-mono uppercase tracking-widest mb-1 block">
                            Event Record #{selectedImage.id}
                        </span>
                        <h2 className="text-white font-display font-bold text-xl md:text-2xl">{selectedImage.title}</h2>
                    </div>
                    
                    {/* Mobile Navigation Buttons (Bottom) */}
                    <div className="flex md:hidden gap-4 w-full pt-2">
                        <button onClick={handlePrev} className="flex-1 py-3 bg-white/10 rounded-lg flex items-center justify-center active:bg-white/20">
                            <ChevronLeft />
                        </button>
                        <button onClick={handleNext} className="flex-1 py-3 bg-white/10 rounded-lg flex items-center justify-center active:bg-white/20">
                            <ChevronRight />
                        </button>
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
