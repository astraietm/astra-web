import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedEvents from '../components/home/FeaturedEvents';
import WhyJoin from '../components/home/WhyJoin';
import GalleryPreview from '../components/home/GalleryPreview';
import BlogPreview from '../components/home/BlogPreview';
import JoinSection from '../components/home/JoinSection';

const Home = () => {
  return (
    <div className="bg-background">
      <Hero />
      <WhyJoin />
      <FeaturedEvents />
      <GalleryPreview />
      <BlogPreview />
      <JoinSection />
    </div>
  );
};

export default Home;
