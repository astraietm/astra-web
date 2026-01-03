import React from 'react';
import Hero from '../components/home/Hero';
import AboutSection from '../components/home/AboutSection';
import FeaturedEvents from '../components/home/FeaturedEvents';
import WhyJoin from '../components/home/WhyJoin';
import GalleryPreview from '../components/home/GalleryPreview';
import JoinSection from '../components/home/JoinSection';

const Home = () => {
  return (
    <div className="bg-background">
      <Hero />
      <AboutSection />
      <FeaturedEvents />
      <WhyJoin />
      <GalleryPreview />
      <JoinSection />
    </div>
  );
};

export default Home;
