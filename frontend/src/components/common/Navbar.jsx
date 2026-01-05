import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
  ];

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      {/* =======================
          DESKTOP NAVBAR (Single Unified Pill Model)
      ======================== */}
      <nav className="hidden md:flex fixed top-6 inset-x-0 z-[100] justify-center px-4 pointer-events-none">
        
        {/* Single Pill Container */}
        <div className="pointer-events-auto relative flex items-center justify-between 
             bg-black/10 backdrop-blur-2xl 
             border border-white/[0.08] ring-1 ring-white/[0.05]
             shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.1)] 
             rounded-full pl-2 pr-2 py-2 h-[64px] w-full max-w-5xl
             transition-all duration-300"
        >
            
            {/* 1. Logo (Left) */}
            <Link 
                to="/" 
                className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 hover:scale-105 transition-transform"
            >
                <div className="w-[44px] h-[44px] bg-black rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" fill="currentColor" />
                </div>
            </Link>

            {/* 2. Navigation Links (ABSOLUTE CENTER) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
                {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                    <Link
                    key={link.name}
                    to={link.path}
                    className={`
                        text-sm md:text-base font-medium tracking-wide transition-all duration-200
                        ${isActive 
                        ? 'text-white font-bold' 
                        : 'text-gray-400 hover:text-white'
                        }
                    `}
                    >
                        {link.name}
                    </Link>
                );
                })}
            </div>
            
            {/* 3. Empty spacer or Right Element (Optional, kept empty to maintain shape) */}
            <div className="w-12"></div> 
        </div>
      </nav>

      {/* =======================
          MOBILE NAVBAR (Unchanged)
      ======================== */}
      <nav className="md:hidden fixed top-4 inset-x-0 z-[100] px-4 pointer-events-none flex justify-center items-start">
          
          <div className="w-full max-w-[340px] relative pointer-events-auto">
              {/* Island Header */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg shadow-black/20 rounded-full p-2 pl-3 flex items-center justify-between h-[60px] relative z-50">
                  
                  {/* Logo Orb */}
                  <Link to="/" className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center group" onClick={() => setIsOpen(false)}>
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 animate-[spin_4s_linear_infinite]" />
                      <div className="absolute inset-[2px] bg-black rounded-full" />
                      <div className="relative z-10 w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-300 to-purple-600 shadow-lg"></div>
                  </Link>
                  
                  {/* Menu Toggle */}
                  <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
                  >
                      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
              </div>

              {/* Compact Dropdown Menu */}
              <AnimatePresence>
                  {isOpen && (
                      <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -20 }}
                          transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                          className="absolute top-[64px] left-0 right-0 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-1.5 shadow-2xl overflow-hidden z-40 flex flex-col gap-0.5"
                      >
                          {navLinks.map((link, i) => (
                              <motion.div
                                key={link.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                              >
                                  <Link
                                      to={link.path}
                                      onClick={() => setIsOpen(false)}
                                      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
                                  >
                                      <span>{link.name}</span>
                                      {/* Tiny dot for active state */}
                                      {location.pathname === link.path && (
                                          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,224,255,1)]" />
                                      )}
                                  </Link>
                              </motion.div>
                          ))}
                          
                          {/* Divider */}
                          <div className="h-px bg-white/5 my-1 mx-2"></div>

                          {/* CTA Button */}
                           <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                           >
                               <Link 
                                    to="/contact" 
                                    onClick={() => setIsOpen(false)} 
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-black text-center text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                                >
                                   <span>Get Started</span>
                                   <ArrowRight className="w-4 h-4" />
                               </Link>
                           </motion.div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>
          
          {/* Touch Backdrop */}
          {isOpen && (
             <div className="fixed inset-0 bg-black/60 z-30 pointer-events-auto" onClick={() => setIsOpen(false)} />
          )}

      </nav>
    </>
  );
};

export default Navbar;
