import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import CommandPalette from '../components/admin/CommandPalette';
import PageLoader from '../components/common/PageLoader';

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || !user.is_staff)) {
            if (!import.meta.env.DEV) {
                navigate('/');
            }
        }
    }, [user, loading, navigate]);

    // Close mobile sidebar on navigation
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Global Command Palette Shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Don't render anything until auth is verified
    if (loading) return null;

    // Redirect non-admin users in production
    if (!import.meta.env.DEV && (!user || !user.is_staff)) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600/30 selection:text-white">
            {/* Top Navigation Bar */}
            <AdminHeader
                onMenuClick={() => setIsMobileOpen(prev => !prev)}
                onSearchClick={() => setIsCommandPaletteOpen(true)}
            />

            <div className="flex-1 flex min-w-0 relative">
                {/* Left Navigation Sidebar */}
                <AdminSidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />

                {/* Main Content Area */}
                <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-60'} ml-0`}>
                    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
                        <Suspense fallback={<PageLoader />}>
                            <Outlet />
                        </Suspense>
                    </div>
                </main>
            </div>

            {/* Global Command Palette */}
            <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} />
        </div>
    );
};

export default AdminLayout;
