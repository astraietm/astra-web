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
                    width: isCollapsed ? 80 : 260,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
                }}
                className={`fixed left-4 top-4 bottom-4 rounded-2xl bg-[#050505]/90 backdrop-blur-xl border border-white/5 flex flex-col z-[100] transition-all duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-2xl`}
            >


            {/* Top Brand/Back Area */}
            <div className="p-6 border-b border-white/5">
                <button
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vision-primary via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 mix-blend-overlay group-hover:opacity-100 opacity-0 transition-opacity"></div>
                        <ArrowLeft size={20} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-black text-white tracking-widest font-mono">ASTRA<span className="text-vision-primary">.OS</span></span>
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest group-hover:text-vision-primary transition-colors">Return to Surface</span>
                        </div>
                    )}
                </button>
            </div>

            {/* Navigation Sections */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 no-scrollbar">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                        {!isCollapsed && (
                            <h3 className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] font-mono mb-2 flex items-center gap-2">
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
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
            <div className="p-4 border-t border-white/5 bg-black/40 rounded-b-2xl">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-mono text-xs shadow-lg relative">
                             <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            {user?.name?.[0].toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate font-mono">{user?.name || 'Admin User'}</p>
                            <p className="text-[10px] text-emerald-500 font-mono truncate tracking-wider">COMMANDER LVL.1</p>
                        </div>
                    </div>
                )}
                
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`w-full h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all group ${isCollapsed ? '' : 'hover:scale-[1.02]'}`}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : (
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest font-mono">
                            <ChevronLeft size={12} />
                            Collapse Sidebar
                        </div>
                    )}
                </button>
            </div>
        </motion.aside>
        </>
    );
};

export default AdminSidebar;
