import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getOptimizedImageUrl } from '../../utils/helpers';

// Optimized Marquee Row with Intersection Observer
const MarqueeRow = ({ items, direction = 'left', speed = 50 }) => {
    const rowRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    // Duplicate just enough for a smooth loop. 
    const rowItems = [...items, ...items, ...items].slice(0, 25); 

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
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
                contain: 'layout paint'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div 
                className={`flex gap-4 md:gap-8 min-w-full py-8 will-change-transform group/marquee`} 
                style={{
                    animation: `marquee-${direction} ${speed}s linear infinite`,
                    animationPlayState: isPaused || isHovered ? 'paused' : 'running',
                    transform: 'translateZ(0)', 
                    backfaceVisibility: 'hidden'
                }}
            >
                {rowItems.map((item, idx) => (
                    <div 
                        key={`${item.id}-${idx}`} 
                        className="relative min-w-[250px] h-[160px] md:min-w-[400px] md:h-[250px] rounded-2xl overflow-hidden bg-white/5 border border-white/5 flex-shrink-0 transition-all duration-500 ease-out 
                        opacity-100 scale-100
                        group-hover/marquee:blur-[4px] group-hover/marquee:opacity-40 group-hover/marquee:scale-100
                        hover:!blur-0 hover:!opacity-100 hover:!scale-105 hover:z-20 hover:shadow-2xl hover:border-primary/50 cursor-pointer bg-black"
                    >
                         {/* Dimming Layer only on group hover (siblings) */}
                         <div className="absolute inset-0 bg-transparent transition-colors duration-500 z-10 pointer-events-none group-hover/marquee:bg-black/20 hover:!bg-transparent"/>
                         
                        <img 
                            src={getOptimizedImageUrl(item.src, 'grid')} 
                            alt="" 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
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

    const sourceImages = images.length < 10 ? [...images, ...images] : images;
    
    const half = Math.ceil(sourceImages.length / 2);
    const row1 = sourceImages.slice(0, half);
    const row2 = sourceImages.slice(half);

    return (
        <section className="py-12 md:py-24 bg-background overflow-hidden relative" style={{ contentVisibility: 'auto' }}>
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
             <div className="container mx-auto px-4 mb-8 md:mb-12 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-2 md:mb-4">
                    Captured Moments
                </h2>
                <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto font-light">
                    Highlights from our workshops, hackathons, and community events.
                </p>
             </div>

            {/* Marquee Container - Full Width */}
            <div className="w-full">
                <div className="flex flex-col gap-4 md:gap-8 relative">
                    <MarqueeRow items={row1} direction="left" speed={30} />
                    <MarqueeRow items={row2} direction="right" speed={35} />
                </div>
            </div>
        </section>
    );
};

export default GalleryMarquee;
