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
                className={`fixed left-0 top-0 h-screen bg-vision-bg border-r border-white/5 flex flex-col z-[100] transition-all duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >


            {/* Top Brand/Back Area */}
            <div className="p-4 border-b border-white/5">
                <button
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all group ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vision-primary to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-vision-primary/50 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-bold text-white tracking-wide">ASTRA ADMIN</span>
                            <span className="text-[10px] text-gray-500">Voltar para Home</span>
                        </div>
                    )}
                </button>
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

            {/* User Profile & Toggle */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-vision-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                            {user?.name?.[0].toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-[10px] text-gray-400 font-mono truncate">{user?.role || 'COMMANDER'}</p>
                        </div>
                    </div>
                )}
                
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`w-full h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all group ${isCollapsed ? '' : 'hover:scale-[1.02]'}`}
                >
                    {isCollapsed ? <ChevronRight size={14} /> : (
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                            <ChevronLeft size={12} />
                            Collapse Panel
                        </div>
                    )}
                </button>
            </div>
        </motion.aside>
        </>
    );
};

export default AdminSidebar;
