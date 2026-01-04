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
          DESKTOP NAVBAR
      ======================== */}
      <nav className="hidden md:block fixed top-6 left-0 w-full z-[100] px-8 pointer-events-none">
        
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo Section */}
            <div className="pointer-events-auto bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-1.5 pr-6 shadow-2xl h-[56px] flex items-center">
                <Link 
                    to="/" 
                    className="flex items-center gap-3 group"
                >
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors">
                        <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-lg font-display font-bold text-white tracking-widest group-hover:text-primary transition-colors">
                        ASTRA
                    </span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="pointer-events-auto bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-2 gap-1 shadow-2xl h-[56px] flex items-center">
                {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                
                return (
                    <Link
                    key={link.name}
                    to={link.path}
                    className={`
                        relative px-6 h-[40px] flex items-center justify-center rounded-full text-xs font-bold tracking-wider transition-colors duration-300
                        ${isActive 
                        ? 'text-black' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }
                    `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_rgba(0,224,255,0.4)]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{ zIndex: 0 }}
                            />
                        )}
                        <span className="relative z-10">{link.name}</span>
                    </Link>
                );
                })}
                
                <Link to="/contact" className="ml-2 px-6 h-[40px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider transition-all">
                    CONTACT
                </Link>
            </div>
        </div>
      </nav>

      {/* =======================
          MOBILE NAVBAR (Compact Premium)
      ======================== */}
      <nav className="md:hidden fixed top-4 inset-x-0 z-[100] px-4 pointer-events-none flex justify-center items-start">
          
          <div className="w-full max-w-[340px] relative pointer-events-auto">
              {/* Island Header */}
              <div className="bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-full p-2 pl-3 flex items-center justify-between h-[60px] relative z-50">
                  
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
                          className="absolute top-[64px] left-0 right-0 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-1.5 shadow-2xl overflow-hidden z-40 flex flex-col gap-0.5"
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
