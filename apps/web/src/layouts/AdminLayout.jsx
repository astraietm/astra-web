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
        <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-inter selection:bg-blue-100 selection:text-blue-900 relative">
            {/* Subtle Background Pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(203_213_225_/_0.15)_1px,transparent_0)] bg-[size:24px_24px]" />
            </div>
            
            <AdminSidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out relative z-10 ${isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'} ml-0`}>
                <AdminHeader 
                    title={getPageTitle()} 
                    onMenuClick={() => setIsMobileOpen(true)} 
                    isSystemOnline={isSystemOnline}
                    onSearchClick={() => setIsCommandPaletteOpen(true)}
                />

                <main className="flex-1 overflow-y-auto relative bg-slate-50">
                    <Suspense fallback={<PageLoader />}>
                        <div className="p-6 md:p-8 lg:p-10 min-h-full max-w-[1600px] mx-auto">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                    className="h-full"
                                >
                                    <Outlet />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Suspense>
                </main>
                
                <footer className="h-14 border-t border-slate-200 flex items-center justify-between px-8 text-[11px] text-slate-500 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                        <span className="font-medium">
                            Astra <span className="text-slate-400">v2.5.0</span>
                        </span>
                        <div className="h-3 w-px bg-slate-200" />
                        <span className="text-slate-400">© 2026 KMCT IETM</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-medium ${
                            isSystemOnline 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isSystemOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{isSystemOnline ? 'All systems operational' : 'System offline'}</span>
                        </div>
                    </div>
                </footer>
            </div>

            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
        </div>
    );
};

export default AdminLayout;
