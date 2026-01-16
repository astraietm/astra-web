import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import ScrollReveal from '../components/common/ScrollReveal';
import GalleryMarquee from '../components/home/GalleryMarquee';
import VisionMission from '../components/home/VisionMission';
import HODMessage from '../components/home/HODMessage';
import ToolsMarquee from '../components/home/ToolsMarquee';
import RecentCollaborations from '../components/home/RecentCollaborations';
import CyberBackground from '../components/common/CyberBackground';

const Home = () => {
  return (
    <div className="bg-background relative min-h-screen">
      <CyberBackground fixed={false} />



      <div className="relative z-10">
        <Hero />
        
        <ToolsMarquee />
        
        <RecentCollaborations />

        <ScrollReveal variant="up" width="100%">
          <VisionMission />
        </ScrollReveal>

        <ScrollReveal variant="blur" width="100%">
          <HODMessage />
        </ScrollReveal>

        <GalleryMarquee />


      </div>
    </div>
  );
};

export default Home;
