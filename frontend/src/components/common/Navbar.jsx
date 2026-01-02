import React, { useState } from 'react';
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

  return (
    <>
    <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="max-w-screen-xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group relative z-50">
                <div className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Shield className="w-5 h-5 text-primary relative z-10" />
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-display font-bold text-white tracking-widest leading-none">ASTRA</span>
                    <span className="text-[10px] text-gray-400 font-mono tracking-wider">SECURE_SYSTEMS</span>
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
                className="relative z-50 p-2 md:hidden text-gray-400 hover:text-white transition-colors"
            >
                {isOpen ? <X /> : <Menu />}
            </button>
      </div>

       {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex items-center justify-center md:hidden"
          >
            <ul className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-display font-bold text-gray-400 hover:text-primary transition-colors hover:tracking-widest duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};

export default Navbar;
