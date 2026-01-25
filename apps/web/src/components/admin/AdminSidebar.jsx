import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
    Activity,
    ArrowLeft,
    Command
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    let sections = [
        { group: "Operations", items: [
            { to: "/admin", icon: LayoutDashboard, label: "Terminal", end: true },
            { to: "/admin/events", icon: Calendar, label: "Event Registry" },
            { to: "/admin/registrations", icon: Users, label: "Users & Access" },
        ]},
        { group: "Resources", items: [
            { to: "/admin/gallery", icon: ImageIcon, label: "Media Assets" },
        ]},
        { group: "Infrastructure", items: [
            { to: "/admin/scanner", icon: QrCode, label: "Access Scan" },
            { to: "/admin/logs", icon: Activity, label: "System Logs" },
            { to: "/admin/settings", icon: Settings, label: "OS Settings" },
        ]}
    ];

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[95] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{ 
                    width: isCollapsed ? 88 : 300,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0)
                }}
                className={`fixed left-0 top-0 h-screen bg-black/60 backdrop-blur-3xl border-r border-white/5 z-[100] transition-all duration-500 flex flex-col shadow-[20px_0_50px_-10px_rgba(0,0,0,0.5)]
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Branding Section */}
                <div className="h-24 flex items-center px-6 border-b border-white/[0.04] shrink-0 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <button 
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-4 w-full relative z-10 transition-transform duration-300 ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-[0_8px_20px_rgba(37,99,235,0.3)] group-hover:shadow-[0_8px_30px_rgba(37,99,235,0.5)] group-hover:scale-105 transition-all duration-500">
                                <Shield size={22} className="fill-white" />
                            </div>
                            <div className="absolute inset-0 rounded-2xl bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex flex-col text-left">
                                <span className="font-black text-white tracking-widest text-lg uppercase">
                                    Astra<span className="text-blue-500">OS</span>
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] leading-none mt-0.5">Admin Interface</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* Navigation Nodes */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-8 custom-scrollbar relative z-10">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            {!isCollapsed && (
                                <div className="px-4 flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                                        {section.group}
                                    </h3>
                                    <div className="h-px flex-1 bg-white/[0.03] ml-4" />
                                </div>
                            )}
                            <div className="space-y-1.5">
                                {section.items.map((item, i) => (
                                    <NavLink
                                        key={i}
                                        to={item.to}
                                        end={item.end}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                                            ${isActive 
                                                ? 'bg-blue-600/[0.08] text-white shadow-[inset_0_0_20px_rgba(37,99,235,0.05)] border border-blue-500/10' 
                                                : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'}
                                        `}
                                    >
                                        <div className={`relative z-10 transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}>
                                            <item.icon size={isCollapsed ? 24 : 20} strokeWidth={isActive ? 2.5 : 2} className="group-hover:scale-110 transition-transform duration-300" />
                                        </div>

                                        {!isCollapsed && (
                                            <span className="font-bold text-[13.5px] tracking-tight relative z-10">
                                                {item.label}
                                            </span>
                                        )}

                                        {/* Active State Aesthetic */}
                                        <NavLink to={item.to} end={item.end} className={({ isActive }) => 
                                            isActive 
                                            ? "absolute left-[-4px] top-1/4 bottom-1/4 w-[3px] bg-blue-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]" 
                                            : "hidden"
                                        } />
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Personnel Access Control */}
                <div className="p-6 border-t border-white/[0.04] bg-black/40 backdrop-blur-3xl relative z-10">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 p-[1px] shrink-0 border border-white/10 overflow-hidden">
                            <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="User" />
                                ) : (
                                    <span className="text-sm font-black text-blue-500">{user?.name?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] leading-none mb-1.5">Authorized User</p>
                                <p className="text-sm font-black text-slate-200 truncate leading-none">{user?.name || 'ROOT@ADMIN'}</p>
                            </div>
                        )}
                        {!isCollapsed && (
                            <div className="flex items-center gap-1 text-slate-600 group-hover:text-blue-500 transition-colors">
                                <Command size={14} className="opacity-50" />
                                <ChevronLeft size={16} />
                            </div>
                        )}
                    </button>
                    
                    {!isCollapsed && (
                        <div className="mt-4 space-y-2">
                             <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-700">
                                <span>Clearance level</span>
                                <span className="text-blue-500/80">LVL_05 ACTIVE</span>
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "92%" }}
                                    transition={{ duration: 2.5, ease: "circOut" }}
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
