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
        <div className="min-h-screen bg-[#020202] text-slate-50 flex overflow-hidden font-inter selection:bg-blue-500/30 selection:text-white relative">
            {/* Background Aesthetic */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-[120px] -ml-64 -mb-64" />
                <NoiseOverlay opacity={0.3} />
            </div>
            
            <AdminSidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-[0.19,1,0.22,1] relative z-10 ${isCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[280px]'} ml-0`}>
                <AdminHeader 
                    title={getPageTitle()} 
                    onMenuClick={() => setIsMobileOpen(true)} 
                    isSystemOnline={isSystemOnline}
                    onSearchClick={() => setIsCommandPaletteOpen(true)}
                />

                <main className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <Suspense fallback={<PageLoader />}>
                        <div className="p-6 md:p-8 lg:p-10 min-h-full max-w-[1600px] mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial={{ opacity: 0, scale: 0.98, y: 10, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 1.02, y: -10, filter: "blur(4px)" }}
                                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                                    className="h-full"
                                >
                                    <Outlet />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Suspense>
                </main>
                
                <footer className="h-14 border-t border-white/5 flex items-center justify-between px-10 text-[10px] uppercase font-black tracking-[0.2em] text-slate-600 bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-6">
                        <span>Astra Admin Interface <span className="text-white/20 ml-2">v2.4.0</span></span>
                        <div className="h-3 w-px bg-white/10 hidden sm:block" />
                        <span className="hidden sm:block">© 2026 KMCT IETM</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSystemOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                        <span className={isSystemOnline ? 'text-emerald-500/80' : 'text-red-500/80'}>
                            {isSystemOnline ? 'Core Uplink Secure' : 'Uplink Compromised'}
                        </span>
                    </div>
                </footer>
            </div>

            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
        </div>
    );
};

export default AdminLayout;
