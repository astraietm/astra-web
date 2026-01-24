import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import GalleryMarquee from '../components/home/GalleryMarquee';

import { EventTracks } from '../components/home/EventTracks';
import { HomeCTA } from '../components/home/HomeCTA';
import CyberBackground from '../components/common/CyberBackground';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans">
      <CyberBackground fixed={false} />
      
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <EventTracks />
        <GalleryMarquee />
        <HomeCTA />
      </main>
    </div>
  );
};

export default Home;
