import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldCheck, Zap, Lock } from 'lucide-react';
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
        if (!path || path === 'admin') return 'DASHBOARD';
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
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                await fetch(`${API_URL}/operations/events/`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                setIsSystemOnline(true);
            } catch (err) {
                setIsSystemOnline(false);
            }
        };
        const interval = setInterval(checkSystem, 60000); // Check every 60s
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
        <div className="min-h-screen bg-[#030303] text-slate-100 flex overflow-hidden font-inter selection:bg-blue-500/30 selection:text-white relative">
            {/* Premium Ambient Architecture */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
                {/* Dynamic Aura Fields */}
                <div className="absolute top-[-25%] right-[-10%] w-[80%] h-[80%] bg-blue-600/[0.08] rounded-full blur-[180px] animate-pulse-glow" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/[0.05] rounded-full blur-[160px]" />
                <div className="absolute top-[20%] left-[30%] w-[60%] h-[60%] bg-cyan-500/[0.03] rounded-full blur-[140px] animate-float" />

                {/* Cyber Grid System */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_90%)]" />

                {/* Deep Contrast Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,3,0.4)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

                <NoiseOverlay opacity={0.3} />
            </div>

            <AdminSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] relative z-10 ${isCollapsed ? 'lg:ml-[100px]' : 'lg:ml-[300px]'} ml-0`}>
                <AdminHeader
                    title={getPageTitle()}
                    onMenuClick={() => setIsMobileOpen(true)}
                    isSystemOnline={isSystemOnline}
                    onSearchClick={() => setIsCommandPaletteOpen(true)}
                />

                <main className="flex-1 overflow-y-auto no-scrollbar relative custom-scrollbar flex flex-col">
                    <div className="flex-1 p-8 md:p-12 2xl:p-16 max-w-[1800px] w-full mx-auto">
                        <Suspense fallback={<PageLoader />}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial={{ opacity: 0, y: 15, scale: 0.99 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -15, scale: 1.01 }}
                                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                                    className="h-full"
                                >
                                    <Outlet />
                                </motion.div>
                            </AnimatePresence>
                        </Suspense>
                    </div>

                    <footer className="h-20 flex items-center justify-between px-12 border-t border-white/[0.03] bg-black/40 backdrop-blur-3xl shrink-0 mt-auto relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.02] to-transparent pointer-events-none" />

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-blue-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">ASTRA_OPERATIONS_PROTOCOLS_V2.6.4</span>
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest font-mono">SECURE_SHA256_ACTIVE</span>
                        </div>

                        <div className="flex items-center gap-8 relative z-10">
                            <div className="hidden xl:flex items-center gap-6 text-slate-800">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em]">ENCRYPTED_SIGNAL_UPLINK</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em]">PRIMARY_CORE_SYNCED</span>
                            </div>

                            <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] transition-all duration-1000 group`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isSystemOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,1)]'} transition-colors duration-1000`} />
                                <span className={`text-[9px] font-black uppercase tracking-[0.5em] ${isSystemOnline ? 'text-emerald-500/80' : 'text-rose-500/80'} group-hover:tracking-[0.6em] transition-all`}>
                                    {isSystemOnline ? 'OPERATIONAL' : 'LINK_VOID'}
                                </span>
                            </div>
                        </div>
                    </footer>
                </main>
            </div>

            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
        </div>
    );
};

export default AdminLayout;
