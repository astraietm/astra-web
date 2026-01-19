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
        <div className="min-h-screen bg-[#08080C] text-white flex overflow-hidden font-inter selection:bg-indigo-500/30 selection:text-white relative">
            
            {/* Ambient Background - Deep Space Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#3B82F6]/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/10 blur-[120px]" />
                
                {/* Technical Grid Overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{ 
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
                        backgroundSize: '40px 40px' 
                    }}
                />
            </div>
            
            <AdminSidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative z-10 ${isCollapsed ? 'lg:ml-[100px]' : 'lg:ml-[300px]'} ml-0`}>
                <AdminHeader 
                    title={getPageTitle()} 
                    onMenuClick={() => setIsMobileOpen(true)} 
                    isSystemOnline={isSystemOnline}
                    onSearchClick={() => setIsCommandPaletteOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-6 md:p-8 relative custom-scrollbar">
                    <Suspense fallback={<PageLoader />}>
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative z-10 h-full max-w-7xl mx-auto"
                        >
                            <Outlet />
                        </motion.div>
                    </Suspense>
                </main>
                
                <footer className="h-10 border-t border-white/5 flex items-center justify-between px-8 text-[10px] text-gray-500 font-medium uppercase tracking-widest backdrop-blur-md bg-[#08080C]/80">
                    <div className="flex gap-4">
                        <span className="text-gray-600 font-mono">ASTRA.OS <span className="text-indigo-500">v2.1.0</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Connected</span>
                    </div>
                </footer>
            </div>

            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
        </div>
    );
};

export default AdminLayout;
