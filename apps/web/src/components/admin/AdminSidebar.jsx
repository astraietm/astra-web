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
                    width: isCollapsed ? 80 : 280,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
                }}
                className={`fixed left-4 top-4 bottom-4 rounded-3xl z-[100] transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) flex flex-col overflow-hidden
                    bg-[#050505]/80 backdrop-blur-3xl border border-white/5 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Internal Lighting */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                {/* Header */}
                <div className="p-6 pb-2 md:pt-8 relative shrink-0">
                    <button 
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 w-full group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="relative w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow duration-500">
                             <div className="w-full h-full rounded-[11px] bg-black/90 flex items-center justify-center">
                                <span className="font-rajdhani font-bold text-lg text-white">A</span>
                             </div>
                        </div>
                        
                        {!isCollapsed && (
                             <div className="flex flex-col items-start overflow-hidden">
                                <span className="font-rajdhani font-bold text-xl text-white tracking-wide leading-none">ASTRA<span className="text-indigo-500">.OS</span></span>
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em] group-hover:text-white transition-colors">System Admin</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-8 custom-scrollbar relative">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-1">
                             {!isCollapsed && (
                                <h3 className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.15em] mb-2 font-inter">
                                    {section.group}
                                </h3>
                            )}
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
                    ))}
                </div>

                {/* Footer / User */}
                <div className="p-4 relative shrink-0 border-t border-white/5 bg-white/[0.01]">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold font-rajdhani text-white">{user?.name?.[0]}</span>
                            )}
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate font-rajdhani">{user?.name || 'Commander'}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium tracking-wider">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    ONLINE
                                </div>
                            </div>
                        )}
                        {!isCollapsed && <ChevronLeft size={14} className="text-gray-500 group-hover:text-white transition-colors" />}
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
