import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
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
    { name: 'Contact', path: '/contact' },
  ];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between relative z-50">
            <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary relative z-10" />
                </div>
                <div className="flex flex-col">
                    <span className="text-base md:text-lg font-display font-bold text-white tracking-widest leading-none">ASTRA</span>
                    <span className="text-[8px] md:text-[10px] text-gray-400 font-mono tracking-wider">SECURE_SYSTEMS</span>
                </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="navbar-pill"
                                    className="absolute inset-0 bg-primary rounded-full"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{link.name}</span>
                        </Link>
                    );
                })}
            </div>

            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50 p-2 md:hidden text-gray-400 hover:text-white transition-colors focus:outline-none"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
      </div>

       {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl h-[100dvh] overflow-y-auto"
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Menu Links */}
            <ul className="relative z-10 flex flex-col gap-3 text-center w-full px-6">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1, type: "spring", stiffness: 100 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`text-3xl md:text-5xl font-display font-bold uppercase tracking-wider transition-all duration-300 block py-1 ${
                            isActive 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 scale-110' 
                            : 'text-gray-500 hover:text-white hover:scale-105'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                );
              })}
            </ul>
             
             {/* Decorative Footer in Menu */}
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-10 left-0 w-full text-center text-xs font-mono text-gray-600 tracking-widest uppercase"
             >
                System Status: <span className="text-primary animate-pulse">Online</span>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};

export default Navbar;
