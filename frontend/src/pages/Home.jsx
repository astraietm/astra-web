import React from 'react';
import Hero from '../components/home/Hero';
import ScrollReveal from '../components/common/ScrollReveal';

import FeaturedEvents from '../components/home/FeaturedEvents';
import WhyJoin from '../components/home/WhyJoin';
import GalleryMarquee from '../components/home/GalleryMarquee';
import JoinSection from '../components/home/JoinSection';
import VisionMission from '../components/home/VisionMission';
import HODMessage from '../components/home/HODMessage';

const Home = () => {
  return (
    <div className="bg-background relative min-h-screen">
      {/* Global Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 animate-[pulse_8s_ease-in-out_infinite]"></div>
      </div>

      <div className="relative z-10">
        <Hero />

        <ScrollReveal variant="up" width="100%">
          <VisionMission />
        </ScrollReveal>

        <ScrollReveal variant="blur" width="100%">
          <HODMessage />
        </ScrollReveal>

        <ScrollReveal variant="up" width="100%">
          <FeaturedEvents />
        </ScrollReveal>

        <ScrollReveal variant="up" width="100%">
          <WhyJoin />
        </ScrollReveal>

        <GalleryMarquee />

        <ScrollReveal variant="scale" width="100%">
          <JoinSection />
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Home;
