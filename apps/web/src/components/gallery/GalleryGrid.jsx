

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Maximize2, X, Filter, ChevronRight, ChevronLeft, Shield, Zap, Terminal, Globe, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getOptimizedImageUrl } from '../../utils/helpers';
import { useLenis } from '../common/SmoothScroll';

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
            whileHover="hover"
            transition={{ 
                duration: 0.4, 
                delay: (index % 9) * 0.05, 
                ease: "easeOut" 
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative rounded-2xl overflow-hidden bg-black border border-white/5 hover:border-cyan-400/50 cursor-pointer h-full w-full transition-colors duration-300 transform-gpu"
            style={{ willChange: "transform" }}
            onClick={onClick}
            // Preload the HIGH QUALITY version on hover
            onMouseEnter={() => preloadImage(getOptimizedImageUrl(item.src, 'modal'))}
            onContextMenu={(e) => e.preventDefault()}
        >
             {/* 4. Cyber neon border (signature hacker look) */}
            <div className="absolute inset-0 pointer-events-none z-30">
                <span className="absolute inset-0 border border-cyan-400/0 group-hover:border-cyan-400/70 rounded-2xl transition-all duration-500 shadow-[0_0_25px_rgba(0,255,255,0.25)]" />
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
                {/* 5. Matrix-style micro noise (Optional but recommended) */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-[radial-gradient(circle,rgba(0,255,255,0.3)_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none z-20" />
                
                {/* 5. Glitch scan line (THIS makes it hacker) */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 animate-[scan_1.2s_linear_infinite] pointer-events-none z-20" />


                <div className="absolute top-2 left-2 w-3 h-3 border-l text-cyan-400 border-t border-cyan-400/0 group-hover:border-cyan-400/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-r text-cyan-400 border-t border-cyan-400/0 group-hover:border-cyan-400/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l text-cyan-400 border-b border-cyan-400/0 group-hover:border-cyan-400/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r text-cyan-400 border-b border-cyan-400/0 group-hover:border-cyan-400/80 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-20"></div>

                <motion.img
                    src={getOptimizedImageUrl(item.src, 'grid')}
                    alt={item.title}
                    loading="lazy"
                    decoding="async" 
                    variants={{
                        rest: { scale: 1, filter: "brightness(0.95)" },
                        hover: { scale: 1.08, filter: "brightness(1.15) contrast(1.15)" }
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full object-cover transform-gpu"
                />

                {/* 3. Dark terminal overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300 pointer-events-none z-10" />

                {/* Overlay with Text */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 z-20 pointer-events-none">
                    {/* 6. Hacker terminal text reveal */}
                    <motion.div
                        variants={{
                            rest: { opacity: 0, y: 12 },
                            hover: { opacity: 1, y: 0 }
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
                            ACCESS_GRANTED
                        </p>
                        <h3 className="text-white font-display font-medium text-lg leading-tight tracking-wide">{item.title}</h3>
                    </motion.div>
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
  
  const lenis = useLenis();

  // Lenis Integration: Stop scrolling when modal is open
  useEffect(() => {
    if (selectedImage) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [selectedImage, lenis]);

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

  // Fallback Data (Mock for when API is empty/unreachable)
  const fallbackItems = [
    { id: 'f1', src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', category: 'workshops', title: 'Cyber Defense Workshop' },
    { id: 'f2', src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', category: 'ctf', title: 'Capture The Flag 2024' },
    { id: 'f3', src: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80', category: 'hackathons', title: 'Midnight Hackathon' },
    { id: 'f4', src: 'https://images.unsplash.com/photo-1563206767-5b1d9727cb15?auto=format&fit=crop&w=800&q=80', category: 'seminars', title: 'Network Security Talk' },
    { id: 'f5', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', category: 'workshops', title: 'Global Threat Analysis' },
    { id: 'f6', src: 'https://images.unsplash.com/photo-1558494949-efdeb6bf80d1?auto=format&fit=crop&w=800&q=80', category: 'ctf', title: 'Hardware Hacking' },
    { id: 'f7', src: 'https://images.unsplash.com/photo-1504384308090-c54be38550dd?auto=format&fit=crop&w=800&q=80', category: 'seminars', title: 'Data Center Tour' },
    { id: 'f8', src: 'https://images.unsplash.com/photo-1597589827318-da833d87d60e?auto=format&fit=crop&w=800&q=80', category: 'hackathons', title: 'Server Infrastructure' },
    { id: 'f9', src: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80', category: 'workshops', title: 'Neon Coding Session' },
  ];

  const fetchGalleryItems = useCallback(async () => {
    try {
        const response = await axios.get(`${API_URL}/gallery/`);
        const mappedItems = response.data.map(item => ({
            id: item.id,
            src: item.image_url,
            category: item.category,
            title: item.title,
        }));
        
        if (mappedItems.length > 0) {
            setItems(mappedItems);
        } else {
            console.warn('API returned empty list, using fallback data.');
            setItems(fallbackItems);
        }
        setLoading(false);
    } catch (error) {
        console.error('Error fetching gallery, using fallback:', error);
        setItems(fallbackItems);
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
          <div className="max-w-7xl mx-auto flex overflow-x-auto no-scrollbar py-4 md:justify-center gap-2 md:gap-8 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/5 px-6 shadow-2xl transition-all duration-300">
            {categories.map((cat) => {
                const isActive = filter === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => { setFilter(cat.id); setVisibleCount(9); }}
                        className={`
                            relative px-4 py-2 flex items-center gap-3 text-sm font-mono tracking-widest uppercase transition-all duration-300 group flex-shrink-0 rounded-lg overflow-hidden
                            ${isActive ? 'text-cyan-400 bg-cyan-400/10' : 'text-gray-500 hover:text-cyan-300 hover:bg-white/5'}
                        `}
                    >
                         {/* Hover Scan (Subtle) */}
                        {!isActive && (
                             <div className="absolute inset-0 bg-cyan-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />
                        )}

                        {/* Icon */}
                        {cat.icon && (
                            <cat.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-600 group-hover:text-cyan-300'}`} />
                        )}
                        
                        {/* Text */}
                        <span className="relative z-10">{cat.label}</span>

                        {/* Active Indicator (Glowing Underline) */}
                        {isActive && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
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
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="relative px-8 py-4 bg-black border border-white/10 hover:border-cyan-400/50 text-white hover:text-cyan-400 rounded-xl font-mono uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-3 group overflow-hidden"
              >
                  {/* Scan Line */}
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-400/50 blur-[2px] translate-x-[-100%] group-hover:animate-[scan-line_1.5s_linear_infinite]" />
                  
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/5 transition-colors duration-300" />

                  <span className="relative z-10">Load More Data</span>
                  <ChevronRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
          </div>
      )}

      {/* Immersive Lightbox Modal */}
      {selectedImage && createPortal(
        <AnimatePresence mode="wait">
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-3xl backdrop-saturate-150 flex items-center justify-center touch-none overscroll-none"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button (Desktop & Mobile) */}
            <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                className="absolute top-6 right-6 z-[100] group cursor-pointer outline-none p-2 rounded-full bg-black/40 border border-white/10 text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300"
                title="Close View"
            >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

             {/* Main Content Area - Full Viewport Height for Mobile */}
             <div 
                className="w-full h-[100dvh] relative flex items-center justify-center"
                onClick={(e) => {
                     e.stopPropagation(); 
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
                                className="absolute left-8 p-4 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors z-[100] hidden md:flex border border-white/10 backdrop-blur-md"
                                onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </motion.button>
                            <motion.button 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                className="absolute right-8 p-4 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors z-[100] hidden md:flex border border-white/10 backdrop-blur-md"
                                onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                            >
                                <ChevronRight className="w-8 h-8" />
                            </motion.button>

                            {/* Details Bar */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-0 left-0 right-0 p-6 pb-12 md:pb-8 bg-gradient-to-t from-black via-black/90 to-transparent z-[100] pointer-events-none"
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
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={selectedImage.id}
                        custom={direction}
                        variants={{
                            enter: (direction) => ({
                                x: direction > 0 ? 1000 : -1000,
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
                                x: direction < 0 ? 1000 : -1000,
                                opacity: 0,
                                scale: 0.95
                            })
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
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
                        className="absolute inset-0 flex items-center justify-center p-0 md:p-10 cursor-grab active:cursor-grabbing transform-gpu w-full h-full"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div 
                            className="relative group/image flex items-center justify-center w-full h-full p-4 md:p-12"
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                // If clicking the container/padding (background), close modal
                                if (e.target === e.currentTarget) {
                                    setSelectedImage(null);
                                } else {
                                    // If clicking the image, toggle UI
                                    setShowUi(!showUi);
                                }
                            }}
                        >
                            {/* Loading State */}
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
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
                                className={`max-w-full max-h-[85vh] object-contain shadow-2xl relative z-10 select-none ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                            />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
             </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default GalleryGrid;
