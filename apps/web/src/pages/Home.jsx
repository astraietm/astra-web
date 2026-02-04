import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import GalleryMarquee from '../components/home/GalleryMarquee';

import CyberBackground from '../components/common/CyberBackground';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans">
      <CyberBackground fixed={false} />
      
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <GalleryMarquee />
      </main>
    </div>
  );
};

export default Home;
