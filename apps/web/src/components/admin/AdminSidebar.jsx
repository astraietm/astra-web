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
                flex items-center gap-3 px-3 py-2.5 my-1 rounded-md transition-all duration-200 group
                ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'}
            `}
        >
            <Icon size={isCollapsed ? 20 : 18} strokeWidth={2} />

            {!isCollapsed && (
                <span className="font-medium text-sm font-inter tracking-tight">
                    {label}
                </span>
            )}
        </NavLink>
    );
};

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    let sections = [
        { group: "Overview", items: [
            { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
            { to: "/admin/events", icon: Calendar, label: "Events" },
            { to: "/admin/registrations", icon: Users, label: "Registrations" },
        ]},
        { group: "Content", items: [
            { to: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
        ]},
        { group: "Tools", items: [
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
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-[95] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ 
                    width: isCollapsed ? 88 : 320,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -320 : 0)
                }}
                className={`fixed left-0 top-0 h-screen bg-slate-950/80 backdrop-blur-2xl border-r border-white/[0.08] z-[100] transition-all duration-700 flex flex-col shadow-2xl shadow-black/50
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Sidebar Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 via-transparent to-blue-600/5 pointer-events-none" />
                
                {/* Header branding */}
                <div className="h-20 flex items-center px-6 border-b border-white/[0.08] shrink-0 relative z-10">
                    <button 
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-4 w-full group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-violet-600/30 group-hover:shadow-violet-600/50 transition-all duration-500 group-hover:scale-110">
                                <Shield size={24} className="fill-white" />
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="font-black text-white tracking-tight text-lg">
                                    Astra<span className="text-violet-400 font-black">OS</span>
                                </span>
                                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none mt-0.5">Admin Console</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* Navigation Nodes */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 space-y-8 custom-scrollbar relative z-10">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-1.5">
                            {!isCollapsed && (
                                <div className="px-4 mb-3">
                                    <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                        {section.group}
                                    </h3>
                                </div>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item, i) => (
                                    <NavLink
                                        key={i}
                                        to={item.to}
                                        end={item.end}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-violet-600/20 to-blue-600/20 text-white shadow-lg shadow-violet-600/10' 
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}
                                        `}
                                    >
                                        {/* Active Gradient Background */}
                                        <NavLink to={item.to} end={item.end} className={({ isActive }) => 
                                            isActive ? "absolute inset-0 bg-gradient-to-r from-violet-600/10 to-blue-600/10 rounded-2xl" : "hidden"
                                        } />
                                        
                                        {/* Active Border */}
                                        <NavLink to={item.to} end={item.end} className={({ isActive }) => 
                                            isActive ? "absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-violet-500 to-blue-500 rounded-r-full shadow-lg shadow-violet-500/50" : "hidden"
                                        } />
                                        
                                        <div className={`relative z-10 transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}>
                                            <item.icon size={isCollapsed ? 24 : 22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-300" />
                                        </div>

                                        {!isCollapsed && (
                                            <span className="font-semibold text-[14px] tracking-tight relative z-10">
                                                {item.label}
                                            </span>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Profile Section */}
                <div className="p-5 border-t border-white/[0.08] bg-slate-950/60 backdrop-blur-xl relative z-10">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all duration-300 group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 p-[2px] shrink-0">
                            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                                ) : (
                                    <span className="text-sm font-black text-white">{user?.name?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-1.5">Admin User</p>
                                <p className="text-sm font-semibold text-white truncate leading-none">{user?.name || 'Administrator'}</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <ChevronLeft size={18} className="text-slate-600 group-hover:text-violet-400 transition-colors" />
                        )}
                    </button>
                    
                    {!isCollapsed && (
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider text-slate-600">
                                <span>Access Level</span>
                                <span className="text-violet-400/90">Premium</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: "90%" }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
