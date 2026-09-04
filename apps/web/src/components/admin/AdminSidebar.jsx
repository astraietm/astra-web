import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard,
    Calendar,
    Users,
    QrCode,
    Bell,
    Image as ImageIcon,
    FileText,
    Settings,
    LogOut,
    ExternalLink,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navigationGroups = [
        {
            label: null, // Overview has no section header
            items: [
                { to: "/admin", icon: LayoutDashboard, label: "Overview", end: true }
            ]
        },
        {
            label: "EVENT MANAGEMENT",
            items: [
                { to: "/admin/events", icon: Calendar, label: "Events" },
                { to: "/admin/registrations", icon: Users, label: "Registrations" },
                { to: "/admin/scanner", icon: QrCode, label: "Ticket Scanner" }
            ]
        },
        {
            label: "COMMUNICATION",
            items: [
                { to: "/admin/notifications", icon: Bell, label: "Announcements" },
                { to: "/admin/gallery", icon: ImageIcon, label: "Media Library" }
            ]
        },
        {
            label: "INSIGHTS",
            items: [
                { to: "/admin/logs", icon: FileText, label: "Activity Logs" }
            ]
        },
        {
            label: "SYSTEM",
            items: [
                { to: "/admin/settings", icon: Settings, label: "Settings" }
            ]
        }
    ];

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out of the admin panel?")) {
            logout();
            navigate('/');
        }
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[95] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside
                className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#0A0C11] border-r border-white/[0.08] z-[90] transition-all duration-300 flex flex-col justify-between
                    ${isCollapsed ? 'w-20' : 'w-60'}
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Navigation Sections */}
                <div className="py-4 px-3 space-y-6 overflow-y-auto no-scrollbar flex-1">
                    {navigationGroups.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-1">
                            {group.label && !isCollapsed && (
                                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 select-none">
                                    {group.label}
                                </p>
                            )}

                            {group.items.map((item, itemIdx) => (
                                <NavLink
                                    key={itemIdx}
                                    to={item.to}
                                    end={item.end}
                                    onClick={() => setIsMobileOpen(false)}
                                    title={isCollapsed ? item.label : undefined}
                                    className={({ isActive }) => `
                                        flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative
                                        ${isActive 
                                            ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20' 
                                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}
                                        ${isCollapsed ? 'justify-center px-0' : ''}
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon 
                                                size={17} 
                                                className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} shrink-0 transition-colors`} 
                                            />
                                            {!isCollapsed && (
                                                <span className="truncate">{item.label}</span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Footer Section */}
                <div className="p-3 border-t border-white/[0.08] space-y-2 bg-[#090A0F]">
                    {/* Public Site Link */}
                    <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        title={isCollapsed ? "Public Website" : undefined}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors ${
                            isCollapsed ? 'justify-center px-0' : ''
                        }`}
                    >
                        <ExternalLink size={15} className="shrink-0" />
                        {!isCollapsed && <span>Public Website</span>}
                    </a>

                    {/* Collapse Sidebar Toggle (Desktop Only) */}
                    <button
                        onClick={() => setIsCollapsed(prev => !prev)}
                        className={`hidden lg:flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors ${
                            isCollapsed ? 'justify-center px-0' : ''
                        }`}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                        {!isCollapsed && <span>Collapse Sidebar</span>}
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        title={isCollapsed ? "Logout" : undefined}
                        className={`w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                            isCollapsed ? 'px-0' : ''
                        }`}
                    >
                        <LogOut size={15} className="shrink-0" />
                        {!isCollapsed && <span>Logout</span>}
                    </button>

                    {/* Version metadata */}
                    {!isCollapsed && (
                        <div className="pt-2 text-center text-slate-400 text-[10px] space-y-0.5 font-mono">
                            <p className="text-slate-400">ASTRA Admin v5.0</p>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
