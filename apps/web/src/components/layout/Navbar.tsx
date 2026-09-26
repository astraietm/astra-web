'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal, Shield, User, LogOut, LayoutDashboard, Settings, Ticket, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLenis } from 'lenis/react';

interface NavLink {
  label: string;
  href: string;
  number?: string;
  isSpecial?: boolean;
}

const navigationLinks: NavLink[] = [
  { number: '01', label: 'ASTRA Overview', href: '/' },
  { number: '02', label: 'Upcoming Events (Oct 6-7)', href: '/events', isSpecial: true },
  { number: '03', label: 'About ASTRA', href: '/about' },
  { number: '04', label: 'Contact', href: '/contact' },
  { number: '05', label: 'My Registrations', href: '/dashboard', isSpecial: true },
];

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, setIsLoginModalOpen, setIsProfileModalOpen, logout } = useAuth();
  const lenis = useLenis();

  const userDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [menuOpen, lenis]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (menuOpen) closeMenu();
        if (userDropdownOpen) setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen, userDropdownOpen, closeMenu]);

  const handleSectionJump = (id: string, e?: React.MouseEvent) => {
    if (pathname === '/') {
      if (e) e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, { offset: -60, duration: 1.2 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      if (menuOpen) closeMenu();
    } else {
      if (menuOpen) closeMenu();
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <>
      {/* ─── 1. FLOATING TOP NAVIGATION BAR ─── */}
      <header className="fixed top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 z-[80] flex items-center justify-between select-none pointer-events-none">
        {/* Left: Index Button & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <button
            id="nav-index-btn"
            type="button"
            onClick={toggleMenu}
            className="group relative flex items-center justify-center px-6 py-1.5 sm:px-7 sm:py-2 bg-black transition-opacity duration-150 hover:opacity-90 active:scale-[0.98] cursor-pointer select-none rounded-none"
            aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={menuOpen}
          >
            <span
              className="uppercase inline-block"
              style={{
                fontFamily: "'Anton', sans-serif",
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '28px',
                color: 'rgb(255, 255, 255)',
              }}
            >
              {menuOpen ? 'CLOSE ✕' : 'INDEX'}
            </span>
          </button>

          <Link
            href="/"
            onClick={() => { if (menuOpen) closeMenu(); }}
            className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md border-2 border-black px-2.5 py-1 sm:px-3 sm:py-1.5 hover:bg-th-yellow transition-colors"
          >
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black" />
            <span className="font-pixel text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-wider">
              ASTRA 2026
            </span>
            <span className="hidden md:inline font-mono text-[9px] text-gray-500 uppercase">
              // KMCT CALICUT
            </span>
          </Link>
        </div>

        {/* Right: Auth & Profile Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {user ? (
            <div className="flex items-center gap-2 relative" ref={userDropdownRef}>
              {/* Quick Access: My Passes */}
              <Link
                href="/dashboard"
                onClick={() => { if (menuOpen) closeMenu(); }}
                className="flex items-center gap-1.5 bg-[#C3FF16] text-black border-2 border-black px-2.5 py-1 sm:px-3.5 sm:py-1.5 font-mono text-[10px] sm:text-xs font-bold uppercase hover:bg-th-yellow transition-colors"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">My Passes</span>
              </Link>

              {/* User Dropdown Toggle */}
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 border-2 border-black px-3 py-1.5 sm:px-3.5 sm:py-1.5 font-mono text-xs font-bold uppercase transition-all select-none cursor-pointer ${
                  userDropdownOpen
                    ? "bg-[#FFE816] text-black shadow-[2px_2px_0px_#000]"
                    : "bg-white/95 backdrop-blur-md text-black hover:bg-[#FFE816] hover:text-black"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-5 h-5 rounded-none border border-black object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-black" />
                  )}
                  {/* Status Indicator Dot */}
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-black animate-pulse" />
                </div>

                <span className="max-w-[110px] truncate tracking-wide">
                  {user.name?.split(' ')[0] || user.full_name?.split(' ')[0] || 'User'}
                </span>

                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Popover */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden z-[90]"
                  >
                    {/* User Identity Header Card */}
                    <div className="bg-[#0C0C14] text-white p-4 border-b-2 border-black">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt=""
                              className="w-11 h-11 border-2 border-white/30 shadow-[2px_2px_0px_#FFE816] object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 bg-white/10 border-2 border-white/30 flex items-center justify-center text-white">
                              <User className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            {user.is_staff ? (
                              <span className="font-pixel text-[8px] bg-[#FFE816] text-black px-1.5 py-0.5 font-bold uppercase tracking-wider">
                                STAFF // ADMIN
                              </span>
                            ) : (
                              <span className="font-pixel text-[8px] bg-white/20 text-white/90 border border-white/20 px-1.5 py-0.5 uppercase tracking-wider">
                                ATTENDEE // 2026
                              </span>
                            )}
                          </div>

                          <p className="font-anton text-base sm:text-lg uppercase text-white tracking-wide leading-tight truncate">
                            {user.name || user.full_name || 'Attendee'}
                          </p>

                          <p className="font-mono text-[10px] text-gray-400 truncate mt-0.5">
                            {user.email}
                          </p>

                          {user.college && (
                            <p className="font-mono text-[9px] text-[#FFE816] truncate mt-0.5">
                              {user.college}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Status Bar */}
                    <div className="bg-[#FFFEE5] border-b border-black/15 px-4 py-1.5 flex items-center justify-between font-mono text-[10px]">
                      <span className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Verified Participant
                      </span>
                      <span className="text-gray-500 font-bold">ASTRA '26</span>
                    </div>

                    {/* Menu Links */}
                    <div className="p-1.5 space-y-1 bg-[#FAF9F6]">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="group flex items-center justify-between p-2.5 bg-white border border-black/10 hover:border-black hover:bg-[#FFE816] transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-[#C3FF16] border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000]">
                            <Ticket className="w-3.5 h-3.5 text-black" />
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-black uppercase block leading-none">
                              My Registrations
                            </span>
                            <span className="font-mono text-[9px] text-gray-500 group-hover:text-black mt-0.5 block">
                              View QR passes &amp; entry tickets
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full group flex items-center justify-between p-2.5 bg-white border border-black/10 hover:border-black hover:bg-th-yellow transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 bg-[#F79CFF] border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000]">
                            <User className="w-3.5 h-3.5 text-black" />
                          </div>
                          <div>
                            <span className="font-mono text-xs font-bold text-black uppercase block leading-none">
                              Edit Profile
                            </span>
                            <span className="font-mono text-[9px] text-gray-500 group-hover:text-black mt-0.5 block">
                              Update phone, college &amp; details
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </Link>

                      {user.is_staff && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="group flex items-center justify-between p-2.5 bg-white border border-black/10 hover:border-black hover:bg-th-pink transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-[#FFE816] border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#000]">
                              <Settings className="w-3.5 h-3.5 text-black" />
                            </div>
                            <div>
                              <span className="font-mono text-xs font-bold text-black uppercase block leading-none">
                                Admin Command Center
                              </span>
                              <span className="font-mono text-[9px] text-gray-500 group-hover:text-black mt-0.5 block">
                                Ticket scanners &amp; event control
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-black opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      )}

                      <div className="border-t border-black/15 my-1" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-between p-2 bg-white border border-transparent hover:border-red-200 hover:bg-red-50 text-red-600 font-mono text-xs font-bold uppercase transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span>Sign Out</span>
                        </div>
                        <span className="font-mono text-[9px] text-red-400">Exit</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => {
                if (menuOpen) closeMenu();
                setIsLoginModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-th-yellow text-black border-2 border-black px-3 py-1.5 sm:px-4 sm:py-2 font-display font-normal text-xs uppercase shadow-none hover:bg-black hover:text-white transition-colors"
              style={{ boxShadow: 'none', textShadow: 'none' }}
            >
              <User className="w-3.5 h-3.5" />
              <span style={{ textShadow: 'none', fontWeight: 400 }}>SIGN IN</span>
            </button>
          )}
        </div>
      </header>

      {/* ─── 2. FULL-SCREEN EDITORIAL INDEX OVERLAY ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[70] bg-[#F0F0FA]/98 backdrop-blur-xl overflow-y-auto"
          >
            {/* Close Button (Top-Right) */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30">
              <button
                type="button"
                onClick={closeMenu}
                className="hidden sm:flex items-center gap-1.5 bg-white border-2 border-black px-3.5 py-2 font-mono text-xs font-bold uppercase hover:bg-th-yellow transition-colors cursor-pointer"
              >
                <span>[ ESC TO CLOSE ]</span>
              </button>
            </div>

            {/* Menu Content */}
            <div className="relative z-10 flex flex-col min-h-screen max-w-5xl mx-auto w-full px-4 sm:px-12 justify-between py-20 sm:py-28">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="text-center pt-2 select-none"
              >
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black text-white px-2.5 sm:px-3 py-1 font-pixel text-[10px] sm:text-xs tracking-wider uppercase mb-2 shadow-[2px_2px_0px_#000]">
                  <Terminal className="w-3 h-3 text-[#C3FF16]" />
                  <span>NATIONAL CYBER SECURITY // DIRECTORY</span>
                </div>
                <h2 className="font-pixel font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight text-black uppercase">
                  INDEX <span className="font-editorial italic font-normal text-pink-600">chapters</span>
                </h2>
                <p className="font-editorial italic text-xs sm:text-base text-gray-600 mt-1 max-w-lg mx-auto">
                  Department of Cyber Security — KMCT Institute of Emerging Technology and Management, Calicut
                </p>
              </motion.div>

              {/* Navigation Links */}
              <nav className="my-auto py-4 sm:py-8 flex flex-col justify-center">
                {navigationLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.32,
                      delay: 0.06 + index * 0.035,
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
                      className="group block border-t border-gray-300 py-2 sm:py-3.5 md:py-4 transition-[background-color,padding] duration-160 ease-[var(--ease-out)] hover:bg-white/80 px-2 sm:px-6 rounded-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-3 sm:gap-6">
                          <span className="font-mono text-xs sm:text-sm text-gray-400 font-bold group-hover:text-black group-hover:scale-110 transition-all">
                            {link.number || `0${index + 1}`}
                          </span>
                          <span className="font-editorial italic text-xl sm:text-3xl md:text-5xl text-black group-hover:text-pink-600 group-hover:translate-x-2.5 transition-[transform,color] duration-160 select-none">
                            {link.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          {link.isSpecial && (
                            <span className="font-pixel text-[9px] sm:text-[10px] bg-th-yellow text-black border border-black px-1.5 sm:px-2 py-0.5 uppercase shadow-[1px_1px_0px_#000] group-hover:bg-th-lime transition-colors">
                              EXPLORE
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-300 group-hover:text-black group-hover:translate-x-2 transition-[transform,color] duration-160 ease-[var(--ease-out)]" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-gray-300" />
              </nav>

              {/* Bottom Actions */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.38, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
              >
                <button
                  type="button"
                  onClick={closeMenu}
                  className="w-full sm:w-auto px-5 py-2.5 border-2 border-black bg-white text-black font-display font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-gray-100 active:scale-95 transition-[transform,background-color] duration-160 shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000] cursor-pointer"
                >
                  Close Directory (ESC)
                </button>
                <Link
                  href="/events"
                  onClick={closeMenu}
                  className="w-full sm:w-auto text-center px-5 py-2.5 bg-black text-white font-display font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-th-yellow hover:text-black border-2 border-black active:scale-95 transition-[transform,background-color,color] duration-160 shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000]"
                >
                  Claim Event Pass →
                </Link>
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="w-full sm:w-auto text-center px-5 py-2.5 bg-th-pink text-black font-display font-semibold text-xs sm:text-sm uppercase tracking-wider border-2 border-black active:scale-95 transition-[transform,background-color,color] duration-160 shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000]"
                  >
                    <LayoutDashboard className="w-4 h-4 inline mr-1" />
                    My Registrations
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      closeMenu();
                      setIsLoginModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-th-lime text-black font-display font-semibold text-xs sm:text-sm uppercase tracking-wider border-2 border-black active:scale-95 transition-[transform,background-color,color] duration-160 shadow-[2px_2px_0px_#000] sm:shadow-[3px_3px_0px_#000] cursor-pointer"
                  >
                    Sign In →
                  </button>
                )}
              </motion.div>
            </div>

            {/* Floating Badge Card (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 30, rotate: 12 }}
              animate={{ opacity: 1, x: 0, rotate: 6 }}
              exit={{ opacity: 0, x: 20, rotate: 10 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="hidden xl:block fixed bottom-12 right-12 z-20 pointer-events-none"
            >
              <div className="paper-texture border-2 border-black p-6 w-64 shadow-[6px_6px_0px_#000] pointer-events-auto rotate-6 hover:rotate-3 transition-transform duration-200">
                <p className="font-pixel text-[10px] uppercase tracking-wider text-gray-500 mb-2">
                  ASTRA 2026
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
