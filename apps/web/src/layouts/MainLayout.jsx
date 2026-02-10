import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import { FooterSection } from '../components/home/FooterSection';
import NoiseOverlay from '../components/common/NoiseOverlay';
import BackgroundOrbs from '../components/common/BackgroundOrbs';
import TerminalBackground from '../components/common/TerminalBackground';

import TerminalOverlay from '../components/common/TerminalOverlay';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';



const MainLayout = () => {
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle on Ctrl+K or Backtick
      if ((e.ctrlKey && e.key === 'k') || e.key === '`') {
        e.preventDefault();
        setShowTerminal(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-background relative overflow-x-hidden max-w-full">
      {/* <NoiseOverlay /> */}
      {/* <MatrixBackground /> Removed per request */}
      <BackgroundOrbs />
      
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <FooterSection />


      <AnimatePresence>
        {showTerminal && <TerminalOverlay onClose={() => setShowTerminal(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
