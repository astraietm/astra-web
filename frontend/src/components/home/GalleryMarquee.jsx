import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// Optimized Marquee Row with Intersection Observer
const MarqueeRow = ({ items, direction = 'left', speed = 50 }) => {
    const rowRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    
    // Duplicate just enough for a smooth loop. 
    // If we have 10 items, 3x is usually enough for 1080p-4k screens if items are 280px wide.
    // 30 items * 280px = ~8400px width. Plenty.
    const rowItems = [...items, ...items, ...items].slice(0, 25); 

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            // Pause animation when not in viewport to save GPU
            setIsPaused(!entry.isIntersecting);
        }, { threshold: 0.1 });

        if (rowRef.current) observer.observe(rowRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={rowRef}
            className="relative flex overflow-hidden w-full select-none" 
            style={{ 
                // Hardware acceleration hints
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                contain: 'layout paint'
            }}
        >
            <div 
                className={`flex gap-4 min-w-full py-2 will-change-transform`}
                style={{
                    animation: `marquee-${direction} ${speed}s linear infinite`,
                    animationPlayState: isPaused ? 'paused' : 'running',
                    transform: 'translateZ(0)', // Force GPU layer
                    backfaceVisibility: 'hidden'
                }}
            >
                {rowItems.map((item, idx) => (
                    <div 
                        key={`${item.id}-${idx}`} 
                        className="relative min-w-[240px] h-[160px] rounded-lg overflow-hidden bg-white/5 border border-white/5 flex-shrink-0"
                        style={{ contain: 'strict' }} // Don't let browser recalc unrelated layout
                    >
                        <img 
                            src={item.src} 
                            alt="" 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover opacity-80"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const GalleryMarquee = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchImages = async () => {
             // Only fetch, don't setState yet to avoid re-renders if unmounted
            try {
                const response = await axios.get(`${API_URL}/gallery/`);
                 // Take top 15 only
                 const mappedItems = response.data
                    .slice(0, 15) 
                    .map(item => ({
                        id: item.id,
                        src: item.image_url, 
                    }));
                setImages(mappedItems);
            } catch (error) {
                console.error("Failed to load gallery images", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [API_URL]);

    if (loading || images.length === 0) return null;

    // Ensure we have enough items for a full row loop
    // If fewer than 10, just duplicate the whole set for both rows to ensure fullness
    const sourceImages = images.length < 10 ? [...images, ...images] : images;
    
    const half = Math.ceil(sourceImages.length / 2);
    const row1 = sourceImages.slice(0, half);
    const row2 = sourceImages.slice(half);

    return (
        <section className="py-24 bg-background overflow-hidden relative" style={{ contentVisibility: 'auto' }}>
             <style>{`
                @keyframes marquee-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                @keyframes marquee-right {
                    0% { transform: translate3d(-50%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }
             `}</style>
             
             {/* Simple Header */}
             <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">
                    Captured Moments
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                    Highlights from our workshops, hackathons, and community events.
                </p>
             </div>

            {/* Marquee Container - Full Width */}
            <div className="w-full flex flex-col gap-6">
                <MarqueeRow items={row1} direction="left" speed={60} />
                <MarqueeRow items={row2} direction="right" speed={70} />
            </div>
        </section>
    );
};

export default GalleryMarquee;
