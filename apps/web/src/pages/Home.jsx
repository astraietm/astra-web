import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import GalleryMarquee from '../components/home/GalleryMarquee';
import { StatsSection } from '../components/home/StatsSection';
import { EventTracks } from '../components/home/EventTracks';
import { TimelineSection } from '../components/home/TimelineSection';
import { FAQSection } from '../components/home/FAQSection';
import HODMessage from '../components/home/HODMessage';
import CyberBackground from '../components/common/CyberBackground';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans">
      <CyberBackground fixed={false} />
      
      <main className="relative z-10">
        <HeroSection />
        <StatsSection />
        <HODMessage />
        <EventTracks />
        <TimelineSection />
        <GalleryMarquee />
        <FAQSection />
      </main>
    </div>
  );
};

export default Home;
