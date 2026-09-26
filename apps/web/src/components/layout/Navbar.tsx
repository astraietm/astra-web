'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Ticket,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Menu,
  X,
  Calendar,
  Compass,
  Mail,
  Home,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useLenis } from 'lenis/react';

interface NavLink {
  label: string;
  href: string;
  number?: string;
  badge?: string;
  description?: string;
  icon?: any;
}

const navigationLinks: NavLink[] = [
  {
    number: '01',
    label: 'Home & Overview',
    href: '/',
    description: 'Welcome to ASTRA 2026 flagship portal',
    icon: Home,
  },
  {
    number: '02',
    label: 'Upcoming Events',
    href: '/events',
    badge: 'Oct 6 & 7',
    description: 'Explore CTF, workshops, and national challenges',
    icon: Calendar,
  },
  {
    number: '03',
    label: 'About ASTRA',
    href: '/#about',
    description: 'Mission, history, and community pillars',
    icon: Compass,
  },
  {
    number: '04',
    label: 'My Registrations',
    href: '/dashboard',
    badge: 'Passes',
    description: 'Access and download your digital entry passes',
    icon: Ticket,
  },
  {
    number: '05',
    label: 'Contact & Support',
    href: '/#contact',
    description: 'Get in touch with student coordinators',
    icon: Mail,
  },
];

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, setIsLoginModalOpen, logout } = useAuth();
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

  // Do not render public floating navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* ─── 1. FLOATING TOP NAVIGATION BAR ─── */}
      <header className="fixed top-3 left-3 right-3 sm:top-5 sm:left-6 sm:right-6 z-[80] flex items-center justify-between select-none pointer-events-none font-sans">
        {/* Left: Menu Trigger & Brand Pill */}
        <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
          {/* Menu Button */}
          <button
            id="nav-index-btn"
            type="button"
            onClick={toggleMenu}
            className={`flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2 rounded-full text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer ${
              menuOpen
                ? 'bg-white text-neutral-950 hover:bg-neutral-100 shadow-xl'
                : 'bg-neutral-900 text-white hover:bg-black hover:shadow-lg'
            }`}
            aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <>
                <X className="w-4 h-4 text-neutral-950" />
                <span>Close</span>
              </>
            ) : (
              <>
                <Menu className="w-4 h-4 text-amber-300" />
                <span>Menu</span>
              </>
            )}
          </button>

          {/* Brand Logo Pill */}
          <Link
            href="/"
            onClick={() => { if (menuOpen) closeMenu(); }}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-neutral-200/80 px-3.5 py-2 rounded-full hover:bg-white hover:border-neutral-300 transition-all shadow-sm group"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-900 group-hover:text-amber-500 transition-colors" />
            <span className="text-xs font-bold text-neutral-950 tracking-tight">
              ASTRA 2026
            </span>
            <span className="hidden md:inline text-[11px] text-neutral-400 font-medium border-l border-neutral-200 pl-2">
              KMCT Calicut
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
                className="hidden sm:flex items-center gap-1.5 bg-neutral-900 text-white hover:bg-black px-3.5 py-2 rounded-full text-xs font-medium tracking-tight transition-all shadow-sm"
              >
                <Ticket className="w-3.5 h-3.5 text-amber-300" />
                <span>My Passes</span>
              </Link>

              {/* User Dropdown Toggle */}
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium transition-all select-none cursor-pointer border ${
                  userDropdownOpen
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                    : "bg-white/90 backdrop-blur-md text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-white shadow-sm"
                }`}
              >
                <div className="relative flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-black/10"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
                      <User className="w-3 h-3" />
                    </div>
                  )}
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
                </div>

                <span className="max-w-[100px] truncate tracking-tight">
                  {user.name?.split(' ')[0] || user.full_name?.split(' ')[0] || 'Account'}
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
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden z-[90]"
                  >
                    {/* User Identity Header Card */}
                    <div className="bg-neutral-950 text-white p-5 border-b border-neutral-800">
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt=""
                              className="w-11 h-11 rounded-full ring-2 ring-white/10 object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-white/10 ring-2 ring-white/10 flex items-center justify-center text-neutral-200">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            {user.is_staff ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                Staff Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-white/10 text-neutral-300 border border-white/10">
                                Attendee
                              </span>
                            )}
                          </div>

                          <p className="font-semibold text-sm sm:text-base text-white tracking-tight truncate leading-tight">
                            {user.name || user.full_name || 'Attendee'}
                          </p>

                          <p className="text-xs text-neutral-400 truncate mt-0.5">
                            {user.email}
                          </p>

                          {user.college && (
                            <p className="text-[11px] text-neutral-400 truncate mt-1">
                              {user.college}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Links */}
                    <div className="p-2.5 space-y-1 bg-white">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="group flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                            <Ticket className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-neutral-900 block leading-tight">
                              My Registrations
                            </span>
                            <span className="text-[11px] text-neutral-500 mt-0.5 block">
                              View QR passes &amp; entry tickets
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="group flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-neutral-900 block leading-tight">
                              Edit Profile
                            </span>
                            <span className="text-[11px] text-neutral-500 mt-0.5 block">
                              Personal details &amp; college info
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                      </Link>

                      {user.is_staff && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="group flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                              <Settings className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-neutral-900 block leading-tight">
                                Admin Dashboard
                              </span>
                              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                                Ticket scanners &amp; event control
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      )}

                      <div className="h-px bg-neutral-100 my-1 mx-2" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full group flex items-center gap-3 p-2.5 rounded-2xl text-neutral-600 hover:text-red-600 hover:bg-red-50/70 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold block leading-tight">
                            Sign Out
                          </span>
                          <span className="text-[11px] text-neutral-400 group-hover:text-red-400 mt-0.5 block">
                            Log out of your account
                          </span>
                        </div>
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
              className="flex items-center gap-1.5 bg-neutral-900 text-white px-4 py-2 rounded-full font-medium text-xs tracking-wide hover:bg-black transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-amber-300" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* ─── 2. SLEEK MODERN FULL-SCREEN MENU OVERLAY ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[75] bg-neutral-950/98 backdrop-blur-3xl overflow-y-auto text-white font-sans flex flex-col justify-between"
          >
            {/* Ambient Background Light Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[160px]" />
              <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px]" />
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                  backgroundSize: '32px 32px',
                }}
              />
            </div>

            {/* Top Close Bar */}
            <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10 pt-8 sm:pt-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-neutral-200 border border-white/15 text-xs font-semibold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>ASTRA 2026 Directory</span>
                </span>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-md active:scale-95 cursor-pointer backdrop-blur-md"
              >
                <span>Close Menu</span>
                <X className="w-4 h-4 text-neutral-300" />
              </button>
            </div>

            {/* Menu Links Center Content */}
            <div className="relative z-10 max-w-4xl mx-auto w-full px-6 sm:px-10 py-12 sm:py-16 my-auto">
              <nav className="space-y-2 sm:space-y-3">
                {navigationLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.05 + index * 0.04,
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
                        className="group flex items-center justify-between p-4 sm:p-5 rounded-3xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className="text-xs sm:text-sm font-semibold text-neutral-500 group-hover:text-amber-400 transition-colors w-6">
                            {link.number}
                          </span>

                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-200 group-hover:text-white transition-colors">
                                {link.label}
                              </span>
                              {link.badge && (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-semibold">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            {link.description && (
                              <p className="text-xs sm:text-sm text-neutral-400 mt-1 hidden sm:block">
                                {link.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-white/20 group-hover:translate-x-1 transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions & Credits */}
            <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10 pb-8 sm:pb-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <p className="text-xs text-neutral-400 text-center sm:text-left">
                KMCT Institute of Emerging Technology &amp; Management • Department of Cyber Security
              </p>

              <div className="flex items-center gap-3">
                <Link
                  href="/events"
                  onClick={closeMenu}
                  className="px-6 py-2.5 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 text-xs font-semibold transition-all shadow-md active:scale-95"
                >
                  Explore All Events →
                </Link>

                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5 text-amber-300" />
                    <span>My Passes</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      closeMenu();
                      setIsLoginModalOpen(true);
                    }}
                    className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all shadow-md active:scale-95"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
