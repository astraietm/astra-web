import React from 'react';
import Hero from '../components/home/Hero';
import ScrollReveal from '../components/common/ScrollReveal';

import FeaturedEvents from '../components/home/FeaturedEvents';
import WhyJoin from '../components/home/WhyJoin';
import GalleryPreview from '../components/home/GalleryPreview';
import JoinSection from '../components/home/JoinSection';
import VisionMission from '../components/home/VisionMission';
import HODMessage from '../components/home/HODMessage';

const Home = () => {
  return (
    <div className="bg-background">
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

      <ScrollReveal variant="up" width="100%">
        <GalleryPreview />
      </ScrollReveal>

      <ScrollReveal variant="scale" width="100%">
        <JoinSection />
      </ScrollReveal>
    </div>
  );
};

export default Home;
