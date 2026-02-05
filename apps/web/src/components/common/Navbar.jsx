import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, ArrowRight, User, LogOut, Ticket, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import HackerText from './HackerText';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false); // Logout animation state
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, setIsLoginModalOpen, setIsProfileModalOpen } = useAuth();
    const profileRef = useRef(null);

    // NEW: Active Tab State to decouple animation from route/scroll
    const [activeTab, setActiveTab] = useState(location.pathname);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Gallery', path: '/gallery' },

    ];

    useEffect(() => {
        setImageError(false);
    }, [user?.avatar]);

    // NEW: Sync activeTab with location (handles back button/refresh)
    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location.pathname]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileOpen]);

    const handleLoginClick = () => {
        setIsOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        // Premium disconnect delay
        await new Promise(resolve => setTimeout(resolve, 800));
        logout();
        setIsProfileOpen(false);
        setIsOpen(false);
        setIsLoggingOut(false);
    }

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <>
            {/* =======================
                DESKTOP NAVBAR
            ======================== */}
            <nav className="hidden md:flex fixed top-6 inset-x-0 z-[100] justify-center px-4 pointer-events-none">
                <div className="pointer-events-auto relative flex items-center justify-between 
                    bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150
                    border border-white/10 ring-1 ring-white/5
                    shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_0_0_1px_rgba(255,255,255,0.05)] 
                    rounded-full pl-2 pr-2 py-1.5 h-[58px] w-full max-w-5xl
                    transition-all duration-300 hover:shadow-[0_8px_32px_0_rgba(0,224,255,0.1)] hover:border-white/20"
                >
                    {/* 1. Logo (Left) */}
                    <Link
                        to="/"
                        onClick={() => setActiveTab('/')}
                        className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full hover:scale-105 transition-transform"
                    >
                        <div className="w-[44px] h-[44px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-center overflow-hidden group-hover:border-primary/50 transition-colors">
                            <img src="/vite.svg" alt="Astra Logo" className="w-[65%] h-[65%] object-contain" />
                        </div>
                    </Link>

                    {/* 2. Navigation Links (Center) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
                        <LayoutGroup id="navbar-links">
                            {navLinks.map((link) => {
                                // NEW: Use activeTab instead of location.pathname
                                const isActive = activeTab === link.path;
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setActiveTab(link.path)}
                                        className="relative px-5 py-2 group"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-white/10 rounded-full"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                style={{ originY: "0px" }} // Anchor Y to prevent vertical jumping
                                            />
                                        )}
                                        <span className={`relative z-10 text-sm font-medium tracking-wide transition-colors duration-200 ${isActive ? 'text-white font-bold' : 'text-gray-300 group-hover:text-white'}`}>
                                            {link.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </LayoutGroup>
                    </div>

                    {/* 3. User / Login (Right) */}
                    <div className="relative" ref={profileRef}>
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full transition-all group"
                                >
                                    <span className="text-xs font-mono text-gray-300 font-medium tracking-wider group-hover:text-white transition-colors max-w-[120px] truncate">
                                        {user.name}
                                    </span>
                                    {user.avatar && !imageError ? (
                                        <div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden relative shadow-inner">
                                            <img
                                                src={user.avatar}
                                                alt="Profile"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={() => setImageError(true)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-cyan-500/20">
                                            {getInitials(user.name)}
                                        </div>
                                    )}
                                </button>

                                {/* Premium Dropdown */}
                                 <AnimatePresence>
                                     {isProfileOpen && (
                                         <motion.div
                                             initial={{ opacity: 0, scale: 0.9, y: 10, filter: "blur(8px)" }}
                                             animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                             exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(8px)" }}
                                             transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                             style={{ willChange: "transform, opacity, filter" }}
                                             className="absolute top-16 right-0 w-60 bg-[#0A0F1C]/80 backdrop-blur-3xl border border-white/10 ring-1 ring-white/5 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden p-2 z-50 origin-top-right will-change-transform"
                                         >
                                             <div className="space-y-1">
                                                 <Link
                                                     to="/my-registrations"
                                                     onClick={() => setIsProfileOpen(false)}
                                                     className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group relative overflow-hidden"
                                                 >
                                                     <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                     <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors relative z-10">
                                                         <Ticket className="w-4 h-4" />
                                                     </div>
                                                     <span className="relative z-10">My Tickets</span>
                                                 </Link>

                                                 <button
                                                     onClick={() => {
                                                         setIsProfileOpen(false);
                                                         setIsProfileModalOpen(true);
                                                     }}
                                                     className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group relative overflow-hidden text-left"
                                                 >
                                                     <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                     <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors relative z-10">
                                                         <User className="w-4 h-4" />
                                                     </div>
                                                     <span className="relative z-10">Edit Profile</span>
                                                 </button>

                                                 {user && user.is_staff && (
                                                     <Link
                                                         to="/admin"
                                                         onClick={() => setIsProfileOpen(false)}
                                                         className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group relative overflow-hidden"
                                                     >
                                                         <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                         <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors relative z-10">
                                                             <Shield className="w-4 h-4" />
                                                         </div>
                                                         <span className="relative z-10">Admin Panel</span>
                                                     </Link>
                                                 )}

                                                 <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-1"></div>

                                                 <button
                                                     onClick={handleLogout}
                                                     disabled={isLoggingOut}
                                                     className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all group relative overflow-hidden text-left"
                                                 >
                                                     <div className="p-2 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors relative z-10">
                                                         {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                                     </div>
                                                     <span className="relative z-10">
                                                         {isLoggingOut ? 'Disconnecting...' : 'Sign Out'}
                                                     </span>
                                                 </button>
                                             </div>
                                         </motion.div>
                                     )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={handleLoginClick}
                                className="relative overflow-hidden group flex items-center gap-2 px-6 py-2.5 rounded-full transition-all"
                            >
                                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 border border-white/10 rounded-full transition-all" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-xl transition-opacity" />
                                <span className="relative z-10 text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <User className="w-3 h-3 text-cyan-400" /> Login
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* =======================
                MOBILE NAVBAR
            ======================== */}
            <nav className="md:hidden fixed top-4 inset-x-0 z-[100] px-4 pointer-events-none flex justify-center items-start">
                <div className="w-full max-w-[340px] mx-auto relative pointer-events-auto">
                    <div className="bg-white/[0.03] backdrop-blur-2xl backdrop-saturate-150 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-full p-1.5 pl-3 flex items-center justify-between h-[58px] relative z-50">
                        <Link to="/" className="relative w-11 h-11 rounded-full overflow-hidden flex items-center justify-center group" onClick={() => setIsOpen(false)}>
                            <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-full group-hover:border-primary/50 transition-colors" />
                            <img src="/vite.svg" alt="Astra Logo" className="relative z-10 w-[60%] h-[60%] object-contain" />
                        </Link>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors active:scale-95 will-change-transform"
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(8px)" }}
                                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(8px)" }}
                                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                                style={{ willChange: "transform, opacity, filter" }}
                                className="absolute top-[64px] left-0 right-0 bg-[#0A0F1C]/80 backdrop-blur-3xl backdrop-saturate-150 border border-white/10 rounded-3xl p-2 shadow-2xl overflow-hidden z-40 flex flex-col gap-1 will-change-transform"
                            >
                                {user && (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 mx-2 mt-2 rounded-2xl border border-white/5">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium text-sm truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                )}

                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="will-change-transform"
                                    >
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group active:bg-white/10"
                                        >
                                            <span>{link.name}</span>
                                            {location.pathname === link.path && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,224,255,1)]" />
                                            )}
                                        </Link>
                                    </motion.div>
                                ))}

                                <div className="h-px bg-white/5 my-1 mx-2"></div>

                                {/* Mobile User Section */}
                                {user ? (
                                    <div className="space-y-1">
                                        <Link
                                            to="/my-registrations"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group active:bg-white/10"
                                        >
                                            <Ticket className="w-4 h-4 text-primary" /> My Tickets
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                setIsProfileModalOpen(true);
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all w-full text-left group active:bg-white/10"
                                        >
                                            <User className="w-4 h-4 text-primary" /> Edit Profile
                                        </button>

                                        {user && user.is_staff && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all group active:bg-white/10"
                                            >
                                                <Shield className="w-4 h-4 text-primary" /> Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all w-full text-left active:bg-red-500/20"
                                        >
                                            {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                            <span>{isLoggingOut ? 'Disconnecting...' : 'Sign Out'}</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLoginClick}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all my-1 active:scale-[0.98]"
                                    >
                                        <User className="w-4 h-4 text-cyan-400" /> AUTHORIZE ACCESS
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 pointer-events-auto" onClick={() => setIsOpen(false)} />}
            </nav>

        </>
    );
};

export default Navbar;
