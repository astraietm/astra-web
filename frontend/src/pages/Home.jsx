import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedEvents from '../components/home/FeaturedEvents';
import WhyJoin from '../components/home/WhyJoin';
import CTA from '../components/home/CTA';

const Home = () => {
  return (
    <div className="bg-background">
      <Hero />
      <WhyJoin />
      <FeaturedEvents />
      <CTA />
    </div>
  );
};

export default Home;
