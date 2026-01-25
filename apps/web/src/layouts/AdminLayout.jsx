import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { motion, AnimatePresence } from 'framer-motion';
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex overflow-hidden font-inter selection:bg-violet-500/30 selection:text-white relative">
            {/* Premium Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-br from-violet-600/10 via-purple-600/5 to-transparent rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-blue-600/10 via-cyan-600/5 to-transparent rounded-full blur-[100px] -ml-64 -mb-64" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-fuchsia-600/5 to-transparent rounded-full blur-[80px]" />
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
                
                {/* Noise Texture */}
                <NoiseOverlay opacity={0.15} />
            </div>
            
            <AdminSidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-700 ease-[0.19,1,0.22,1] relative z-10 ${isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[320px]'} ml-0`}>
                <AdminHeader 
                    title={getPageTitle()} 
                    onMenuClick={() => setIsMobileOpen(true)} 
                    isSystemOnline={isSystemOnline}
                    onSearchClick={() => setIsCommandPaletteOpen(true)}
                />

                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <Suspense fallback={<PageLoader />}>
                        <div className="p-8 md:p-10 lg:p-12 min-h-full max-w-[1800px] mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial={{ opacity: 0, scale: 0.97, y: 20, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 1.03, y: -20, filter: "blur(8px)" }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="h-full"
                                >
                                    <Outlet />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Suspense>
                </main>
                
                <footer className="h-16 border-t border-white/[0.06] flex items-center justify-between px-12 text-[10px] uppercase font-bold tracking-[0.15em] text-slate-500 bg-slate-950/60 backdrop-blur-2xl relative overflow-hidden">
                    {/* Footer Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-blue-600/5 pointer-events-none" />
                    
                    <div className="flex items-center gap-8 relative z-10">
                        <span className="flex items-center gap-2">
                            <span className="text-white/80">Astra</span>
                            <span className="text-white/20">•</span>
                            <span className="text-white/40">v2.5.0</span>
                        </span>
                        <div className="h-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden sm:block" />
                        <span className="hidden sm:block text-white/30">© 2026 KMCT IETM</span>
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className={`relative w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}>
                                <div className={`absolute inset-0 rounded-full ${isSystemOnline ? 'bg-emerald-400' : 'bg-rose-400'} animate-ping opacity-75`} />
                            </div>
                            <span className={`text-[9px] font-semibold ${isSystemOnline ? 'text-emerald-400/90' : 'text-rose-400/90'}`}>
                                {isSystemOnline ? 'System Online' : 'System Offline'}
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
