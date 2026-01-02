import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import NoiseOverlay from '../components/common/NoiseOverlay';
import BackgroundOrbs from '../components/common/BackgroundOrbs';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white font-sans selection:bg-primary selection:text-background relative">
      <NoiseOverlay />
      <BackgroundOrbs />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
