import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

const images = [
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1590402494637-a2ae37a858ef?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1614064641938-3bcee529cfc4?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
];

const GalleryGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {images.map((src, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group overflow-hidden rounded-2xl bg-surface border border-white/5 cursor-pointer ${
                    [0, 3, 5, 6].includes(index) ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
            >
                <img
                    src={src}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <motion.div
                         initial={{ scale: 0.5, rotate: -45 }}
                         whileHover={{ scale: 1.1, rotate: 0 }}
                         className="w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center transform transition-transform"
                    >
                        <Maximize2 className="w-6 h-6" />
                    </motion.div>
                </div>
            </motion.div>
        ))}
    </div>
  );
};

export default GalleryGrid;
