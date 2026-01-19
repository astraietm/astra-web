import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// ... (imports)

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
    Activity,
    ArrowLeft
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
    const { user } = useAuth();
    const navigate = useNavigate();

    let sections = [
        { group: "Main", items: [
            { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
            { to: "/admin/events", icon: Calendar, label: "Events" },
            { to: "/admin/registrations", icon: Users, label: "Registrations" },
        ]},
        { group: "Content", items: [
            { to: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
        ]},
        { group: "System", items: [
            { to: "/admin/scanner", icon: QrCode, label: "Scanner" },
            { to: "/admin/logs", icon: Activity, label: "Logs" },
            { to: "/admin/settings", icon: Settings, label: "Settings" },
        ]}
    ];

    // Role-based Filtering
    if (user?.role === 'VOLUNTEER') {
        sections = [
            { group: "Volunteer Access", items: [
                { to: "/admin/scanner", icon: QrCode, label: "Scanner" },
                { to: "/admin/registrations", icon: Users, label: "Registrations" },
            ]}
        ];
    }

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
                    width: isCollapsed ? 88 : 280,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
                }}
                className={`fixed left-6 top-6 bottom-6 rounded-[24px] flex flex-col z-[100] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden
                    bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-2xl
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
             {/* Glass Reflection */}
             <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-0" />

            {/* Top Brand Area */}
            <div className="p-6 pb-2 relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-4 w-full p-2.5 rounded-2xl transition-all group ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#9333EA] flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
                         <div className="absolute inset-0 bg-white/20 mix-blend-overlay rounded-xl" />
                        <ArrowLeft size={22} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col items-start min-w-0">
                            <span className="text-base font-bold text-white tracking-tight font-display leading-none mb-1">ASTRA<span className="text-indigo-400">.ADMIN</span></span>
                            <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase group-hover:text-white transition-colors">Back to Website</span>
                        </div>
                    )}
                </button>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 no-scrollbar relative z-10 my-4">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        {!isCollapsed && (
                            <h3 className="px-5 text-[11px] font-bold text-indigo-200/50 uppercase tracking-[0.15em] mb-3">
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
                                    end={item.end}
                                    onClick={() => setIsMobileOpen(false)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* User Profile & Toggle */}
            <div className="p-4 m-2 mt-0 bg-white/[0.02] border border-white/5 rounded-2xl relative z-10 backdrop-blur-md">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 mb-4 px-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 p-[1px]">
                             <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center relative overflow-hidden">
                                  {user?.avatar ? (
                                    <img src={user.avatar} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-sm font-bold text-indigo-400">{user?.name?.[0]}</span>
                                  )}
                             </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-indigo-400 font-medium tracking-wide">SYSTEM ADMIN</p>
                        </div>
                    </div>
                )}
                
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`w-full h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 group`}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : (
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                             <span className="group-hover:-translate-x-1 transition-transform">
                                <ChevronLeft size={14} />
                            </span>
                            Collapse
                        </div>
                    )}
                </button>
            </div>
        </motion.aside>
        </>
    );
};

export default AdminSidebar;
