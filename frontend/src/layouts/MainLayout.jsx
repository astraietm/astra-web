import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import NoiseOverlay from '../components/common/NoiseOverlay';
import BackgroundOrbs from '../components/common/BackgroundOrbs';
import TerminalBackground from '../components/common/TerminalBackground';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-background relative">
      <NoiseOverlay />
      {/* <MatrixBackground /> Removed per request */}
      <BackgroundOrbs />
      
      {/* Decorative Fixed HUD Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 p-6 hidden lg:block">
          <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-primary/30"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-primary/30"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-primary/30"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-primary/30"></div>
          
          <div className="absolute top-1/2 left-6 w-1 h-12 bg-primary/20 -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-6 w-1 h-12 bg-primary/20 -translate-y-1/2"></div>
      </div>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
