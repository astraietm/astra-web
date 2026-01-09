import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { motion, AnimatePresence } from 'framer-motion';
import NoiseOverlay from '../components/common/NoiseOverlay';

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

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

    if (loading) return null; // Or a minimalist loader

    return (
        <div className="min-h-screen bg-[#030014] text-white flex overflow-hidden">
            <NoiseOverlay />
            
            {/* Sidebar Component */}
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-[280px]'}`}>
                <AdminHeader title={getPageTitle()} />
                
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -mr-48 -mt-48 z-0"></div>
                    
                    {/* Page Content with Transitions */}
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative z-10"
                    >
                        <Outlet />
                    </motion.div>
                </main>
                
                {/* Fixed Status Footer */}
                <footer className="h-10 bg-[#0A0A0B] border-t border-white/5 flex items-center justify-between px-8 text-[10px] font-mono text-gray-600 tracking-widest uppercase">
                    <div className="flex gap-6">
                        <span>SECURITY_STATUS: NOMINAL</span>
                        <span>ACCESS_PROTOCOL: ENCRYPTED</span>
                    </div>
                    <div>
                        ASTRA_SECURE_ADMIN_V2.0
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AdminLayout;
