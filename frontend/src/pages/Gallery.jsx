import React from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid';

const Gallery = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Our <span className="text-primary">Gallery</span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
                Snapshots from our events, workshops, and community gatherings.
            </p>
        </div>

        <GalleryGrid />
      </div>
    </div>
  );
};

export default Gallery;
