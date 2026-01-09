import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const SidebarItem = ({ to, icon: Icon, label, isCollapsed }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative
                ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
            `}
        >
            {({ isActive }) => (
                <>
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {!isCollapsed && (
                        <span className="font-medium tracking-wide text-sm whitespace-nowrap">{label}</span>
                    )}
                    
                    {/* Active Indicator Bar */}
                    {isActive && (
                        <motion.div 
                            layoutId="active-sidebar-bar"
                            className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
};

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const sections = [
        { group: "MAIN", items: [
            { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
            { to: "/admin/events", icon: Calendar, label: "Events" },
            { to: "/admin/registrations", icon: Users, label: "Registrations" },
        ]},
        { group: "CONTENT", items: [
            { to: "/admin/gallery", icon: ImageIcon, label: "Gallery Manager" },
            { to: "/admin/blog", icon: FileText, label: "Blog Posts" },
        ]},
        { group: "SYSTEM", items: [
            { to: "/admin/scanner", icon: QrCode, label: "Attendance (QR)" },
            { to: "/admin/notifications", icon: Mail, label: "Emails" },
            { to: "/admin/logs", icon: Activity, label: "System Logs" },
            { to: "/admin/settings", icon: Settings, label: "Settings" },
        ]}
    ];

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="fixed left-0 top-0 h-screen bg-[#0A0A0B] border-r border-white/5 flex flex-col z-[100] transition-all duration-300"
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3 border-b border-white/5 h-20">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                </div>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col"
                    >
                        <span className="font-display font-bold text-white tracking-widest text-lg leading-none">ASTRA</span>
                        <span className="text-[10px] font-mono text-primary tracking-[0.2em] font-black">CONSOLE v2.4</span>
                    </motion.div>
                )}
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 no-scrollbar">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        {!isCollapsed && (
                            <h3 className="px-4 text-[10px] font-mono text-gray-600 font-black tracking-[0.3em] uppercase mb-4">
                                {section.group}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item, i) => (
                                <SidebarItem 
                                    key={i} 
                                    to={item.to} 
                                    icon={item.icon} 
                                    label={item.label} 
                                    isCollapsed={isCollapsed} 
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Toggle Button */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                >
                    {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>
        </motion.aside>
    );
};

export default AdminSidebar;
