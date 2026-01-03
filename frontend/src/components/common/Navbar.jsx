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
      <nav className="fixed top-6 left-0 w-full z-[100] px-4 md:px-8 pointer-events-none">
        
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo Section (Left Pill) */}
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

            {/* Desktop Navigation (Right Pill) */}
            <div className="hidden md:flex pointer-events-auto bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-2 gap-1 shadow-2xl h-[56px] items-center">
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
            </div>

            {/* Mobile Toggle (Right Pill for Mobile) */}
            <div className="md:hidden pointer-events-auto bg-black/50 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-2xl h-[56px] flex items-center justify-center aspect-square">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-40 bg-black/95 flex items-center justify-center md:hidden"
            >
                <div className="flex flex-col items-center gap-8 font-display">
                    {navLinks.map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                            <Link
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-4xl font-bold tracking-wider transition-colors py-2 px-4 ${
                                    location.pathname === link.path ? 'text-primary' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
