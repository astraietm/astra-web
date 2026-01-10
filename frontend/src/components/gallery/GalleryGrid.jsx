

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Maximize2, X, Filter, ChevronRight, ChevronLeft, Shield, Zap, Terminal, Globe, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getOptimizedImageUrl } from '../../utils/helpers';

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'workshops', label: 'Workshops', icon: Terminal },
  { id: 'ctf', label: 'CTF', icon: Shield },
  { id: 'seminars', label: 'Seminars', icon: Globe },
  { id: 'hackathons', label: 'Hackathons', icon: Zap },
];

const preloadImage = (src) => {
  if (!src) return;
  const img = new Image();
  img.src = src;
};



const GalleryCard = ({ item, index, onClick }) => {
    // We trust the browser cache. If the image is loaded, it shows.
    // We only animate the CONTAINER entrance, not the image blur.
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
                duration: 0.4, 
                delay: (index % 9) * 0.05, 
                ease: "easeOut" 
            }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-2xl overflow-hidden bg-surface border border-white/5 hover:border-primary/50 cursor-pointer h-full w-full transition-colors duration-300 transform-gpu"
            style={{ willChange: "transform" }}
            onClick={onClick}
            // Preload the HIGH QUALITY version on hover
            onMouseEnter={() => preloadImage(getOptimizedImageUrl(item.src, 'modal'))}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                <div className="absolute top-2 left-2 w-3 h-3 border-l text-primary border-t border-primary/0 group-hover:border-primary/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-r text-primary border-t border-primary/0 group-hover:border-primary/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l text-primary border-b border-primary/0 group-hover:border-primary/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r text-primary border-b border-primary/0 group-hover:border-primary/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"></div>

                <img
                    src={getOptimizedImageUrl(item.src, 'grid')}
                    alt={item.title}
                    loading="lazy"
                    decoding="async" 
                    className="w-full h-full object-cover transform-gpu transition-transform duration-700 group-hover:scale-105"
                />

                {/* Scanline Effect (Hover) */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/0 via-primary/5 to-primary/0 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out pointer-events-none z-10 will-change-transform"></div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5 transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <div className="transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 will-change-transform">
                        <span className="text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-2 block flex items-center gap-2">
                             <Terminal className="w-3 h-3" />
                            ASTRA // {categories.find(c => c.id === item.category)?.label}
                        </span>
                        <h3 className="text-white font-display font-medium text-lg leading-tight tracking-wide">{item.title}</h3>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const GalleryGrid = () => {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(9);
  const [showUi, setShowUi] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);
  const lastScrollTime = React.useRef(0);
  const [imageLoading, setImageLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Core Logic & Helpers (Defined first to avoid hoisting issues)
  const filteredItems = React.useMemo(() => {
      return filter === 'all' 
        ? items 
        : items.filter(item => item.category === filter);
  }, [items, filter]);

  const visibleItems = React.useMemo(() => {
      return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const fetchGalleryItems = useCallback(async () => {
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
  }, [API_URL]);

  const navigate = useCallback((dir) => {
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
    let nextIndex;
    if (dir === 'next') {
        nextIndex = (currentIndex + 1) % filteredItems.length;
        setPage(p => [p[0] + 1, 1]);
    } else {
        nextIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        setPage(p => [p[0] - 1, -1]);
    }
    setSelectedImage(filteredItems[nextIndex]);
  }, [selectedImage, filteredItems]);

  // 2. Effects
  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  // Sync loading state & Preload Neighbors
  useEffect(() => {
     if (selectedImage) {
         setImageLoading(true);
         const currentIndex = filteredItems.findIndex(item => item.id === selectedImage.id);
         const nextItem = filteredItems[(currentIndex + 1) % filteredItems.length];
         const prevItem = filteredItems[(currentIndex - 1 + filteredItems.length) % filteredItems.length];
         
         // Preload using the MODAL optimized size
         if (nextItem) preloadImage(getOptimizedImageUrl(nextItem.src, 'modal'));
         if (prevItem) preloadImage(getOptimizedImageUrl(prevItem.src, 'modal'));
     }
  }, [selectedImage, filteredItems]);


  // Scroll Lock & Wheel Nav
  useEffect(() => {
    if (selectedImage) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      const handleWheel = (e) => {
        const now = Date.now();
        if (now - lastScrollTime.current < 400) return;
        if (Math.abs(e.deltaY) > 30) {
            navigate(e.deltaY > 0 ? 'next' : 'prev');
            lastScrollTime.current = now;
        }
      };

      window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      return () => {
         window.removeEventListener('wheel', handleWheel, { capture: true });
         document.body.style.position = '';
         document.body.style.top = '';
         document.body.style.width = '';
         document.body.style.overflow = '';
         window.scrollTo(0, scrollY);
      };
    }
  }, [selectedImage, navigate]);

   // Logic defined above



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


    //Consolidated scroll lock logic is already at 116 area

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
      {/* Modern Filter Tabs */}
      <div className="sticky top-20 z-30 -mx-4 px-4 md:-mx-0 md:px-0 mb-8">
          <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar py-4 md:justify-center gap-2 md:gap-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 px-6 shadow-2xl transition-all duration-300">
            {categories.map((cat) => {
                const isActive = filter === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => { setFilter(cat.id); setVisibleCount(9); }}
                        className={`
                            relative px-2 py-2 flex items-center gap-3 text-sm font-mono tracking-widest uppercase transition-all duration-300 group flex-shrink-0
                            ${isActive ? 'text-primary' : 'text-gray-500 hover:text-white'}
                        `}
                    >
                        {/* Icon */}
                        {cat.icon && (
                            <cat.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'text-gray-600 group-hover:text-white'}`} />
                        )}
                        
                        {/* Text */}
                        <span className="relative z-10">{cat.label}</span>

                        {/* Active Indicator (Glowing Underline) - No stretching */}
                        {isActive && (
                            <motion.div 
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: '100%' }}
                                transition={{ duration: 0.3 }}
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary shadow-[0_0_15px_rgba(0,224,255,1)] mx-auto"
                            />
                        )}
                    </button>
                );
            })}
          </div>
      </div>

      {/* Gallery Grid - CSS Grid (3 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0 auto-rows-fr">
        <AnimatePresence mode='popLayout'>
          {visibleItems.map((item, index) => (
            <GalleryCard 
                key={item.id} 
                item={item} 
                index={index}
                onClick={() => setSelectedImage(item)} 
            />
          ))}
        </AnimatePresence>
      </div>

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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-2xl saturate-150 flex items-center justify-center touch-none"
            onClick={() => setSelectedImage(null)}
          >
            {/* Desktop Custom Close Button */}
            <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                className="absolute top-8 right-8 z-[60] hidden md:block group cursor-pointer outline-none hover:rotate-90 duration-300"
                title="Close View"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50px"
                    height="50px"
                    viewBox="0 0 24 24"
                    className="stroke-zinc-400 fill-none group-hover:fill-zinc-800 group-active:stroke-zinc-200 group-active:fill-zinc-600 group-active:duration-0 duration-300 rotate-45"
                >
                    <path
                        d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                        strokeWidth="1.5"
                    ></path>
                    <path d="M8 12H16" strokeWidth="1.5"></path>
                    <path d="M12 16V8" strokeWidth="1.5"></path>
                </svg>
            </button>
             {/* Main Content Area - Full Viewport Height for Mobile */}
             <div 
                className="w-full h-[100dvh] relative flex flex-col md:flex-row items-center justify-center"
                onClick={(e) => {
                    // Stop bubbling only if clicking UI elements, not background
                    // Actually, if we click background here, it propagates to parent.
                    // But the Image Container (motion.div below) needs to handle its own clicks.
                     e.stopPropagation(); 
                     // If we click the 'empty' space here (if any), treat as close?
                     // Or pass to parent? 
                     // Simplest: this Div covers screen. It handles the click.
                     if (e.target === e.currentTarget) setSelectedImage(null);
                }}
             >

                {/* UI: Controls Overlay */}
                <AnimatePresence>
                    {showUi && (
                        <>
                            {/* Nav Buttons (Desktop Only - Mobile uses gestures) */}
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
                                className="absolute bottom-0 left-0 right-0 p-6 pb-12 md:pb-8 bg-gradient-to-t from-black via-black/80 to-transparent z-40 pointer-events-none"
                            >
                                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end md:items-center gap-2 pointer-events-auto">
                                    <div>
                                        <div className="flex items-center gap-3 text-gray-400 text-xs font-mono font-medium mb-2">
                                            <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                                                {filteredItems.findIndex(i => i.id === selectedImage.id) + 1} / {filteredItems.length}
                                            </div>
                                            <span className="hidden md:block">ASTRA.SECURE.NET</span>
                                        </div>
                                        <h2 className="text-white font-display font-medium text-xl md:text-3xl leading-tight tracking-wide drop-shadow-xl">
                                            {selectedImage.title}
                                        </h2>
                                    </div>
                                    <div className="hidden md:flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Carousel Navigation - Wraps the content that slides */}
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={selectedImage.id}
                        custom={direction}
                        variants={{
                            enter: (direction) => ({
                                x: direction > 0 ? '100%' : '-100%',
                                opacity: 0,
                                scale: 0.95
                            }),
                            center: {
                                zIndex: 1,
                                x: 0,
                                opacity: 1,
                                scale: 1
                            },
                            exit: (direction) => ({
                                zIndex: 0,
                                x: direction < 0 ? '100%' : '-100%',
                                opacity: 0,
                                scale: 0.95
                            })
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 400, damping: 40 },
                            opacity: { duration: 0.3 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.4}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) {
                                navigate('next');
                            } else if (swipe > swipeConfidenceThreshold) {
                                navigate('prev');
                            }
                        }}
                        className="absolute inset-0 flex items-center justify-center p-0 md:p-10 cursor-grab active:cursor-grabbing transform-gpu"
                        style={{ willChange: "transform, opacity" }}
                    >
                        <motion.div 
                            className="relative group/image flex items-center justify-center w-full h-full p-4 transform-gpu"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{ willChange: "transform, opacity" }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 350, 
                                damping: 32
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowUi(!showUi);
                            }}
                        >
                            {/* Loading State */}
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transform-gpu">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin will-change-transform"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse will-change-transform"></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <img
                                src={getOptimizedImageUrl(selectedImage.src, 'modal')}
                                alt={selectedImage.title}
                                draggable="false"
                                loading="eager"
                                decoding="async"
                                onLoad={() => setImageLoading(false)}
                                className={`max-w-full max-h-[85dvh] object-contain pointer-events-none drop-shadow-2xl relative z-10 transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
