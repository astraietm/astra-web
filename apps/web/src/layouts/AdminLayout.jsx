import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import NoiseOverlay from '../components/common/NoiseOverlay';
import CommandPalette from '../components/admin/CommandPalette';
import PageLoader from '../components/common/PageLoader';

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isSystemOnline, setIsSystemOnline] = useState(true);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    // Get page title from route
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop();
        if (!path || path === 'admin') return 'COMMAND CENTER';
        return path.toUpperCase().replace(/-/g, ' ');
    };

    useEffect(() => {
        if (!loading && (!user || !user.is_staff)) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    // System Integrity Check
    useEffect(() => {
        const checkSystem = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                await fetch(`${API_URL}/heartbeat/`);
                setIsSystemOnline(true);
            } catch (err) {
                setIsSystemOnline(false);
            }
        };
        const interval = setInterval(checkSystem, 30000); // Check every 30s
        checkSystem();
        return () => clearInterval(interval);
    }, []);

    // Close mobile sidebar on navigation
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Global Command Palette Shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Don't render anything until auth is verified
    if (loading) return null;

    // Redirect non-admin users immediately
    if (!user || !user.is_staff) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#020202] text-slate-100 flex overflow-hidden font-inter selection:bg-blue-500/30 selection:text-white relative">
            {/* High-End Ambient Lighting */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-10%] w-[35%] h-[45%] bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] left-[10%] w-[20%] h-[20%] bg-violet-600/5 rounded-full blur-[80px]" />

                {/* Micro-Dot Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />

                <NoiseOverlay opacity={0.15} />
            </div>

            <AdminSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] relative z-10 ${isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[300px]'} ml-0`}>
                <AdminHeader
                    title={getPageTitle()}
                    onMenuClick={() => setIsMobileOpen(true)}
                    isSystemOnline={isSystemOnline}
                    onSearchClick={() => setIsCommandPaletteOpen(true)}
                />

                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <Suspense fallback={<PageLoader />}>
                        <div className="p-8 md:p-10 min-h-full max-w-[1800px] mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial={{ opacity: 0, scale: 0.98, y: 15, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 1.02, y: -15, filter: "blur(10px)" }}
                                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                                    className="h-full"
                                >
                                    <Outlet />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Suspense>
                </main>

                <footer className="h-16 border-t border-white/[0.04] flex items-center justify-between px-10 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 bg-black/40 backdrop-blur-xl">
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-blue-500" />
                            Astra Command <span className="text-white/20">|</span> <span className="text-white/40">v2.6.0</span>
                        </span>
                        <div className="h-4 w-px bg-white/5 hidden sm:block" />
                        <span className="hidden sm:block text-white/20">© 2026 KMCT IETM</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] shadow-inner transition-colors duration-500`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isSystemOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                            <span className={`text-[9px] font-bold ${isSystemOnline ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                                {isSystemOnline ? 'OS_CORE_ONLINE' : 'OS_CORE_DISCONNECTED'}
                            </span>
                        </div>
                    </div>
                </footer>
            </div>

            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
        </div>
    );
};

export default AdminLayout;
