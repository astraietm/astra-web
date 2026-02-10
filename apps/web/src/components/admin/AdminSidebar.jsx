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
    Command,
    LogOut,
    Database,
    Zap,
    Cpu,
    Terminal,
    Target
} from 'lucide-react';

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    let sections = [
        {
            group: "CORE_SYSTEMS", items: [
                { to: "/admin", icon: LayoutDashboard, label: "Dashboard_Core", end: true },
            ]
        },
        {
            group: "OPERATIONS", items: [
                { to: "/admin/events", icon: Calendar, label: "Event_Matrices" },
                { to: "/admin/registrations", icon: Target, label: "Registry_Nodes" },
            ]
        },
        {
            group: "ARCHIVES", items: [
                { to: "/admin/gallery", icon: ImageIcon, label: "Visual_Archive" },
            ]
        },
        {
            group: "DIAGNOSTICS", items: [
                { to: "/admin/scanner", icon: QrCode, label: "Identity_Scanner" },
                { to: "/admin/logs", icon: Terminal, label: "System_Audit" },
                { to: "/admin/settings", icon: Settings, label: "Tactical_Config" },
            ]
        }
    ];

    if (user?.role === 'VOLUNTEER') {
        sections = [
            {
                group: "VOLUNTEER_UPLINK", items: [
                    { to: "/admin/scanner", icon: QrCode, label: "Scan_Identity" },
                    { to: "/admin/registrations", icon: Users, label: "Node_Registry" },
                ]
            }
        ];
    }

    const handleLogout = () => {
        if (window.confirm("CRITICAL_PROCEDURE: TERMINATE_ADMIN_SESSION?")) {
            logout();
            navigate('/');
        }
    };

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
                        className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[95] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 100 : 300,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0)
                }}
                className={`fixed left-0 top-0 h-screen bg-black/20 backdrop-blur-3xl border-r border-white/[0.03] z-[100] transition-all duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] flex flex-col
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Branding Section */}
                <div className="h-24 flex items-center px-8 shrink-0 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-5 w-full relative z-10 transition-transform duration-700 ${isCollapsed ? 'justify-center translate-x-1' : ''}`}
                    >
                        <div className="relative group/logo">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-white shrink-0 group-hover/logo:bg-blue-600 group-hover/logo:border-blue-500 transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.1)] group-hover/logo:shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                                <Zap className="w-6 h-6 fill-white stroke-none group-hover/logo:scale-110 transition-transform" />
                            </div>
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col text-left">
                                <span className="font-black text-white tracking-[0.3em] text-sm uppercase leading-none">
                                    ASTRA<span className="text-blue-500">_OPS</span>
                                </span>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] leading-none mt-2">CMDR_SYSTEM</span>
                            </div>
                        )}
                    </button>

                    <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-white/[0.05] via-transparent to-transparent" />
                </div>

                {/* Navigation Nodes */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-10 px-6 space-y-12 relative z-10">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-6">
                            {!isCollapsed && (
                                <div className="px-4 flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">
                                        {section.group}
                                    </h3>
                                    <div className="h-px flex-1 bg-white/[0.02] ml-6" />
                                </div>
                            )}
                            <div className="space-y-2">
                                {section.items.map((item, i) => (
                                    <NavLink
                                        key={i}
                                        to={item.to}
                                        end={item.end}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-700 group relative overflow-hidden
                                            ${isActive
                                                ? 'bg-blue-600/[0.05] text-white border border-blue-500/20'
                                                : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.02] border border-transparent'}
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-bg"
                                                        className="absolute inset-0 bg-blue-600/5 pointer-events-none"
                                                    />
                                                )}

                                                <div className={`relative z-10 transition-all duration-700 ${isCollapsed ? 'mx-auto' : ''}`}>
                                                    <item.icon size={isCollapsed ? 24 : 18} strokeWidth={isActive ? 3 : 2} className={`${isActive ? 'text-blue-500' : ''} group-hover:scale-110 transition-transform duration-500`} />
                                                </div>

                                                {!isCollapsed && (
                                                    <span className={`font-black uppercase tracking-[0.15em] text-[11px] relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} transition-colors duration-500`}>
                                                        {item.label}
                                                    </span>
                                                )}

                                                {isActive && !isCollapsed && (
                                                    <motion.div
                                                        layoutId="active-indicator"
                                                        className="absolute right-5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,1)]"
                                                    />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* System Footprint / Logout */}
                <div className="p-8 border-t border-white/[0.03] bg-black/10 backdrop-blur-3xl relative z-10">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-5 p-5 rounded-[1.75rem] bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-700 group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="relative w-12 h-12 rounded-2xl bg-white/[0.01] border border-white/[0.05] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:border-blue-500/30">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Operator" />
                            ) : (
                                <User className="w-5 h-5 text-blue-500" />
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500/20" />
                        </div>

                        {!isCollapsed && (
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">AUTH_NODE_VAL</p>
                                <p className="text-sm font-black text-white truncate leading-none uppercase tracking-tight">{user?.first_name || 'OPERATOR'}</p>
                            </div>
                        )}

                        {!isCollapsed && (
                            <div className="flex items-center text-slate-500 group-hover:text-blue-500 transition-colors">
                                <ChevronLeft size={18} />
                            </div>
                        )}
                    </button>

                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                onClick={handleLogout}
                                className="mt-6 w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(244,63,94,0.05)]"
                            >
                                <LogOut size={14} strokeWidth={3} />
                                TERMINATE_UPLINK
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
