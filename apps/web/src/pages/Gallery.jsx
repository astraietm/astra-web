import React from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';

import CyberBackground from '../components/common/CyberBackground';

const Gallery = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
      <CyberBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                ASTRA <span className="text-primary">|</span> Event Gallery
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Captured moments from our cybersecurity journey. 
                <span className="block text-sm font-mono text-primary/60 mt-2 tracking-widest uppercase">
                    // Secure_Archive_Access_Granted
                </span>
            </p>
        </div>

        <GalleryGrid />
      </div>
    </div>
  );
};

export default Gallery;
