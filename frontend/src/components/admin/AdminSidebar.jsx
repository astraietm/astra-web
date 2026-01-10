import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    Image as ImageIcon, 
    QrCode, 
    Mail, 
    FileText, 
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    Activity
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, isCollapsed, end = false, onClick }) => {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 my-1 rounded-lg transition-all duration-300 group relative overflow-hidden
                ${isActive 
                    ? 'bg-vision-primary/10 text-white' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}
            `}
        >
            {({ isActive }) => (
                <>
                    {/* Active Indicator Bar */}
                    {isActive && (
                        <motion.div 
                            layoutId="activeSidebarBar"
                            className="absolute left-0 top-1 bottom-1 w-[3px] bg-vision-primary shadow-[0_0_10px_#6366f1] rounded-r-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}

                    <div className={`
                        relative z-10 transition-transform duration-300 
                        ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'group-hover:scale-105'}
                    `}>
                        <Icon size={20} className={isActive ? 'text-vision-primary' : 'text-gray-400 group-hover:text-gray-200'} />
                    </div>

                    {!isCollapsed && (
                        <span className={`font-medium text-sm font-inter relative z-10 ${isActive ? 'text-white tracking-wide' : ''}`}>
                            {label}
                        </span>
                    )}
                </>
            )}
        </NavLink>
    );
};

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const sections = [
        { group: "Main", items: [
            { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
            { to: "/admin/events", icon: Calendar, label: "Events" },
            { to: "/admin/registrations", icon: Users, label: "Registrations" },
        ]},
        { group: "Content", items: [
            { to: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
            { to: "/admin/blog", icon: FileText, label: "Blog" },
        ]},
        { group: "System", items: [
            { to: "/admin/scanner", icon: QrCode, label: "Scanner" },
            { to: "/admin/notifications", icon: Mail, label: "Notifications" },
            { to: "/admin/logs", icon: Activity, label: "Logs" },
            { to: "/admin/settings", icon: Settings, label: "Settings" },
        ]}
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ 
                    width: isCollapsed ? 80 : 260,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
                }}
                className={`fixed left-0 top-0 h-screen bg-vision-bg border-r border-white/5 flex flex-col z-[100] transition-all duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3 border-b border-border h-16">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col"
                    >
                        <span className="font-semibold text-white text-base">Admin Panel</span>
                        <span className="text-xs text-gray-500">Management Console</span>
                    </motion.div>
                )}
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 no-scrollbar">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-1">
                        {!isCollapsed && (
                            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase mb-2">
                                {section.group}
                            </h3>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item, i) => (
                                <SidebarItem 
                                    key={i} 
                                    to={item.to} 
                                    icon={item.icon} 
                                    label={item.label} 
                                    isCollapsed={isCollapsed} 
                                    end={item.end}
                                    onClick={() => setIsMobileOpen(false)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Toggle Button */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>
        </motion.aside>
        </>
    );
};

export default AdminSidebar;
