

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
  const [visibleCount, setVisibleCount] = useState(9);
  const [showUi, setShowUi] = useState(true); // Toggle for immersive mode

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      setShowUi(true);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedImage]);

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

  // Navigation Logic
  const navigate = useCallback((direction) => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % filteredItems.length;
    } else {
        nextIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    }
    setSelectedImage(filteredItems[nextIndex]);
  }, [selectedImage, filteredItems]);

  // Keyboard navigation
  useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedImage) return;
            if (e.key === 'ArrowRight') navigate('next');
            if (e.key === 'ArrowLeft') navigate('prev');
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, navigate]);


  // Swipe Logic
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
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
              whileTap={{ scale: 0.98 }}
              key={item.id}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-surface border border-white/5 cursor-pointer transform transition-transform duration-200"
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

      {/* Immersive Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center touch-none"
            onClick={() => setSelectedImage(null)}
          >
             {/* Main Content Area - Full Viewport Height for Mobile */}
             <div className="w-full h-[100dvh] relative flex flex-col md:flex-row items-center justify-center">

                {/* UI: Controls Overlay */}
                <AnimatePresence>
                    {showUi && (
                        <>
                            {/* Close Button */}
                            <motion.button 
                                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                                className="absolute top-4 right-4 md:top-6 md:right-6 p-3 rounded-full bg-black/40 text-white z-50 backdrop-blur-md border border-white/10 active:scale-95 touch-manipulation"
                                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                            >
                                <X className="w-6 h-6" />
                            </motion.button>

                            {/* Nav Buttons (Desktop) */}
                            <motion.button 
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="absolute left-8 p-4 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors z-40 hidden md:flex border border-white/10 backdrop-blur-md"
                                onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </motion.button>
                            <motion.button 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="absolute right-8 p-4 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors z-40 hidden md:flex border border-white/10 backdrop-blur-md"
                                onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                            >
                                <ChevronRight className="w-8 h-8" />
                            </motion.button>

                            {/* Details Bar */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black via-black/80 to-transparent z-40 pointer-events-none"
                            >
                                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end md:items-center gap-2 pointer-events-auto">
                                    <div>
                                        <span className="text-primary text-xs font-mono uppercase tracking-widest mb-1 block">
                                            Event Record #{selectedImage.id}
                                        </span>
                                        <h2 className="text-white font-display font-bold text-xl md:text-3xl leading-tight">{selectedImage.title}</h2>
                                    </div>
                                    <div className="hidden md:flex items-center gap-2 text-gray-400 text-sm font-mono">
                                        <Globe className="w-4 h-4" />
                                        <span>ASTRA.SECURE.NET</span>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Draggable Image */}
                <motion.div
                    key={selectedImage.id} // Re-render on ID change to reset position
                    className="w-full h-full flex items-center justify-center p-0 md:p-10 cursor-grab active:cursor-grabbing"
                    onClick={(e) => { e.stopPropagation(); setShowUi(!showUi); }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) {
                            navigate('next');
                        } else if (swipe > swipeConfidenceThreshold) {
                            navigate('prev');
                        }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <img
                        src={selectedImage.src}
                        alt={selectedImage.title}
                        draggable="false"
                        className="max-w-full max-h-full object-contain pointer-events-none drop-shadow-2xl"
                    />
                </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
