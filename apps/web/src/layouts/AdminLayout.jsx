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
        <div className="min-h-screen bg-[#030305] text-white flex overflow-hidden font-inter selection:bg-indigo-500/30 selection:text-white">
            <NoiseOverlay />
            
            {/* Ambient Background Effects - Premium Aurora */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-800/10 blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[150px] mix-blend-screen" />
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] rounded-full bg-fuchsia-900/5 blur-[120px] mix-blend-screen animate-pulse" />
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
            </div>
            
            {/* Sidebar Component */}
            <AdminSidebar 
                isCollapsed={isCollapsed} 
                setIsCollapsed={setIsCollapsed} 
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] relative z-10 ${isCollapsed ? 'lg:ml-24' : 'lg:ml-[300px]'} ml-0`}>
                <AdminHeader 
                    title={getPageTitle()} 
                    onMenuClick={() => setIsMobileOpen(true)} 
                    isSystemOnline={isSystemOnline}
                    onSearchClick={() => setIsCommandPaletteOpen(true)}
                />

                
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
                    {/* Page Content with Transitions */}
                    <Suspense fallback={<PageLoader />}>
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-10 h-full max-w-7xl mx-auto"
                        >
                            <Outlet />
                        </motion.div>
                    </Suspense>
                </main>
                
                {/* Fixed Status Footer */}
                <footer className="h-8 border-t border-white/5 flex items-center justify-between px-6 text-[10px] text-gray-500 font-medium uppercase tracking-widest backdrop-blur-md bg-white/[0.01]">
                    <div className="flex gap-6">
                        <span className="text-gray-600">ASTRA OS <span className="text-indigo-500/50">v2.0.4</span></span>
                        <span className="flex items-center gap-1.5"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"/> SECURE CONNECTION</span>
                    </div>
                </footer>
            </div>

            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
        </div>
    );
};

export default AdminLayout;
