'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationLinks } from '@/data/navigation';
import { ArrowRight, X, ArrowUpRight, Sparkles, Terminal, Shield } from 'lucide-react';

const SECTIONS = [
  { id: 'vision', number: '01', title: 'The Vision' },
  { id: 'mission', number: '02', title: 'The Arena Between' },
  { id: 'pillars', number: '03', title: 'Four Pillars' },
  { id: 'journey', number: '04', title: 'Action Plan' },
  { id: 'impact', number: '05', title: 'Impact' },
  { id: 'get-involved', number: '06', title: 'Get Involved' },
  { id: 'stories', number: '07', title: 'Stories' },
];

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('vision');
  const pathname = usePathname();

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [menuOpen, openMenu, closeMenu]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, closeMenu]);

  // Smooth scroll helper for on-page sections
  const handleSectionJump = (id: string, e?: React.MouseEvent) => {
    if (pathname === '/') {
      if (e) e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
      if (menuOpen) closeMenu();
    } else {
      if (menuOpen) closeMenu();
    }
  };

  // Section observer on home page
  useEffect(() => {
    if (pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const currentSectionMeta = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <>
      {/* ─── 1. ICONIC FLOATING TOP NAVIGATION BAR ─── */}
      <header className="fixed top-4 left-4 sm:top-5 sm:left-6 right-4 sm:right-6 z-[80] flex items-center justify-between pointer-events-none select-none">
        {/* Left: Floating Index Button & Brand Identity Tag */}
        <div className="flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
          <button
            id="nav-index-btn"
            type="button"
            onClick={toggleMenu}
            className={`group relative flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 border-2 border-black font-editorial italic text-base sm:text-lg tracking-wide shadow-[3px_3px_0px_#000] transition-[transform,box-shadow,background-color,color] duration-160 ease-[var(--ease-out)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] cursor-pointer ${
              menuOpen
                ? 'bg-[#F79CFF] text-black hover:bg-black hover:text-white'
                : 'bg-black text-white hover:bg-th-yellow hover:text-black hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000]'
            }`}
            aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={menuOpen}
          >
            {/* Pulsing LED Indicator */}
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  menuOpen ? 'bg-red-500' : 'bg-emerald-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  menuOpen ? 'bg-red-600' : 'bg-emerald-400'
                }`}
              />
            </span>

            {/* Index Text */}
            <span className="font-bold tracking-wide">
              {menuOpen ? 'CLOSE ✕' : 'INDEX'}
            </span>
          </button>

          {/* Floating Campus Identity Badge */}
          <Link
            href="/"
            onClick={() => {
              if (menuOpen) closeMenu();
            }}
            className="flex items-center gap-2 bg-white/95 backdrop-blur-md border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:bg-th-yellow transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-black" />
            <span className="font-pixel text-[11px] font-bold text-black uppercase tracking-wider">
              ASTRA 2026
            </span>
            <span className="hidden md:inline font-mono text-[9px] text-gray-500 uppercase">
              // KMCT CALICUT
            </span>
          </Link>
        </div>

        {/* Right: Quick Action Navigation Buttons (Desktop) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1.5 bg-white/95 backdrop-blur-md border-2 border-black p-1 shadow-[2px_2px_0px_#000]">
            <Link
              href="/events"
              className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-colors ${
                pathname === '/events'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              Events
            </Link>
            <Link
              href="/gallery"
              className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-colors ${
                pathname === '/gallery'
                  ? 'bg-black text-white'
                  : 'text-black hover:bg-gray-100'
              }`}
            >
              Gallery
            </Link>
          </div>

          <Link
            href="/events#pass-registration"
            className="inline-flex items-center gap-1.5 bg-th-yellow text-black border-2 border-black px-3.5 py-2 sm:px-4 sm:py-2.5 font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#000] hover:bg-white hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-[transform,box-shadow,background-color] duration-160 ease-[var(--ease-out)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CLAIM PASS</span>
            <span className="sm:hidden">PASS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ─── 2. FLOATING SECTION DOCK (TINKERHUB STYLE BOTTOM INDICATOR) ─── */}
      {!menuOpen && pathname === '/' && (
        <aside
          aria-label="Current chapter indicator"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md border-2 border-black px-4 py-2 shadow-[4px_4px_0px_#000] transition-transform duration-200 ease-[var(--ease-out)] hover:scale-105"
        >
          <button
            onClick={() => handleSectionJump(currentSectionMeta.id)}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <span className="font-pixel text-[10px] bg-black text-white px-1.5 py-0.5 font-bold">
              {currentSectionMeta.number}
            </span>
            <span className="font-editorial italic text-sm text-black group-hover:text-pink-600 transition-colors">
              {currentSectionMeta.title}
            </span>
          </button>

          <span className="text-gray-300">|</span>

          {/* Quick Jump Dots */}
          <div className="flex items-center gap-1.5">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={(e) => handleSectionJump(s.id, e)}
                title={`Jump to ${s.title}`}
                className={`w-2.5 h-2.5 border border-black transition-[background-color,transform] duration-160 cursor-pointer ${
                  activeSection === s.id
                    ? 'bg-black scale-125'
                    : 'bg-gray-200 hover:bg-th-yellow hover:scale-110'
                }`}
                aria-label={`Jump to chapter ${s.number}: ${s.title}`}
              />
            ))}
          </div>
        </aside>
      )}

      {/* ─── 3. FULL-SCREEN EDITORIAL INDEX OVERLAY (FRAMER MOTION) ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[75] w-screen h-screen overflow-y-auto flex flex-col justify-between bg-[#F0F0FA] bg-graph-paper"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Index"
          >
            {/* Menu Main Content Container */}
            <div className="relative z-10 flex flex-col min-h-screen max-w-5xl mx-auto w-full px-6 sm:px-12 justify-between py-20 sm:py-24">
              {/* Top Brand Header */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="text-center pt-2"
              >
                <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 font-pixel text-xs tracking-wider uppercase mb-2">
                  <Terminal className="w-3 h-3 text-[#C3FF16]" />
                  <span>NATIONAL CYBER CONCLAVE // 2026</span>
                </div>
                <h2 className="font-pixel font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-black uppercase">
                  INDEX <span className="font-editorial italic font-normal text-pink-600">directory</span>
                </h2>
                <p className="font-editorial italic text-sm sm:text-base text-gray-600 mt-1 max-w-lg mx-auto">
                  Department of Cyber Security — KMCT Institute of Emerging Technology and Management, Calicut
                </p>
              </motion.div>

              {/* Navigation Chapter Links (Staggered Entrance) */}
              <nav className="my-auto py-6 sm:py-8 flex flex-col justify-center">
                {navigationLinks.map((link, index) => {
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.08 + index * 0.04,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => {
                          if (link.href.startsWith('/#')) {
                            const sectionId = link.href.replace('/#', '');
                            handleSectionJump(sectionId, e);
                          } else {
                            closeMenu();
                          }
                        }}
                        className="group block border-t border-gray-300 py-2.5 sm:py-3.5 md:py-4 transition-[background-color,padding] duration-160 ease-[var(--ease-out)] hover:bg-white/80 px-4 sm:px-6 rounded-md"
                      >
                        <div className="flex items-center justify-between">
                          {/* Left: Index number + Editorial Chapter Title */}
                          <div className="flex items-baseline gap-4 sm:gap-6">
                            <span className="font-mono text-xs sm:text-sm text-gray-400 font-bold group-hover:text-black transition-colors">
                              {link.number || `0${index + 1}`}
                            </span>
                            <span className="font-editorial italic text-2xl sm:text-4xl md:text-5xl text-black group-hover:text-pink-600 group-hover:translate-x-2 transition-[transform,color] duration-160 select-none">
                              {link.label}
                            </span>
                          </div>

                          {/* Right: Badge & Sliding Arrow */}
                          <div className="flex items-center gap-2">
                            {link.isSpecial && (
                              <span className="font-pixel text-[10px] bg-th-yellow text-black border border-black px-2 py-0.5 uppercase shadow-[1px_1px_0px_#000]">
                                EXPLORE
                              </span>
                            )}
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 group-hover:text-black group-hover:translate-x-2 transition-[transform,color] duration-160 ease-[var(--ease-out)]" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
                {/* Bottom border for last link */}
                <div className="border-t border-gray-300" />
              </nav>

              {/* Bottom Actions Bar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
              >
                <button
                  onClick={closeMenu}
                  className="px-6 py-2.5 border-2 border-black bg-white text-black font-display font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-gray-100 active:scale-95 transition-[transform,background-color] duration-160 shadow-[3px_3px_0px_#000] cursor-pointer"
                >
                  Close Directory (ESC)
                </button>
                <Link
                  href="/events#pass-registration"
                  onClick={closeMenu}
                  className="px-6 py-2.5 bg-black text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-th-yellow hover:text-black border-2 border-black active:scale-95 transition-[transform,background-color,color] duration-160 shadow-[3px_3px_0px_#000]"
                >
                  Claim Event Pass →
                </Link>
              </motion.div>
            </div>

            {/* ─── 4. FLOATING TILTED CARD (DESKTOP RIGHT SIDE) ─── */}
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 12 }}
              animate={{ opacity: 1, x: 0, rotate: 6 }}
              exit={{ opacity: 0, x: 30, rotate: 10 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="hidden xl:block fixed bottom-12 right-12 z-20 pointer-events-none"
            >
              <div className="paper-texture border-2 border-black p-6 w-64 shadow-[6px_6px_0px_#000] pointer-events-auto hover:rotate-3 transition-transform duration-200">
                <p className="font-pixel text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                  ASTRA CONCLAVE 2026
                </p>
                <p className="font-pixel text-2xl font-bold uppercase leading-tight text-black">
                  OCTOBER<br />6 &amp; 7
                </p>
                <p className="font-editorial italic text-xs text-gray-600 mt-2">
                  24H National CTF &amp; Ethical Hacking Hackathon
                </p>
                <div className="mt-3 pt-3 border-t border-black/10 flex items-center justify-between text-[9px] font-mono text-gray-600">
                  <span>KMCT CALICUT</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

