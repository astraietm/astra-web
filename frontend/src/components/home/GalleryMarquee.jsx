import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const MarqueeRow = ({ items, direction = 'left', speed = 20 }) => {
    return (
        <div className="flex overflow-hidden relative w-full group">
            <motion.div
                className="flex gap-6 min-w-full"
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
            >
                {[...items, ...items, ...items].map((item, idx) => ( // Tripled for smoothness
                    <div 
                        key={`${item.id}-${idx}`} 
                        className="relative min-w-[300px] h-[200px] rounded-2xl overflow-hidden border border-white/5 bg-white/5 flex-shrink-0 group/card transition-transform hover:scale-[1.02] hover:border-white/20"
                    >
                        <img 
                            src={item.src} 
                            alt={item.title} 
                            className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-500"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="text-white font-mono text-xs uppercase tracking-widest">{item.title}</span>
                         </div>
                    </div>
                ))}
            </motion.div>
            
            {/* Gradient Fade Edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
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
                 const mappedItems = response.data.map(item => ({
                    id: item.id,
                    src: item.image_url,
                    category: item.category,
                    title: item.title,
                }));
                setImages(mappedItems);
            } catch (error) {
                console.error("Failed to load gallery images for marquee", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [API_URL]);

    if (loading) return null;
    if (images.length === 0) return null;

    // Split images into two rows if enough, otherwise duplicate
    const half = Math.ceil(images.length / 2);
    const row1 = images.slice(0, half);
    const row2 = images.slice(half);
    
    // If not enough images for two distinct rows, just reuse all
    const safeRow1 = row1.length > 2 ? row1 : images;
    const safeRow2 = row2.length > 2 ? row2 : images;

    return (
        <section className="py-24 bg-background overflow-hidden relative">
             <div className="container mx-auto px-4 mb-12 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                     <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                        Captured Moments
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        A visual journey through our workshops, hackathons, and community events.
                    </p>
                </motion.div>
             </div>

            <div className="space-y-6">
                <MarqueeRow items={safeRow1} direction="left" speed={40} />
                <MarqueeRow items={safeRow2} direction="right" speed={45} />
            </div>
        </section>
    );
};

export default GalleryMarquee;
