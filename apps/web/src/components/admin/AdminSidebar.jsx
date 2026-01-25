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
                className={`fixed left-0 top-0 h-screen bg-[#050505] border-r border-white/5 z-[100] transition-all duration-300 flex flex-col
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header branding */}
                <div className="h-20 flex items-center px-8 border-b border-white/5 shrink-0">
                    <button 
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-4 w-full group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500">
                             <Shield size={20} className="fill-white" />
                        </div>
                        
                        {!isCollapsed && (
                             <div className="flex flex-col">
                                <span className="font-black text-white tracking-widest text-sm uppercase">Astra<span className="text-blue-500 font-black">OS</span></span>
                                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em] leading-none mt-1">Admin Interface</span>
                             </div>
                        )}
                    </button>
                </div>

                {/* Navigation Nodes */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-10 custom-scrollbar">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-2">
                             {!isCollapsed && (
                                <div className="px-4 flex items-center gap-3 mb-4">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                                        {section.group}
                                    </h3>
                                    <div className="h-px w-2 bg-white/5" />
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
                                            flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative
                                            ${isActive 
                                                ? 'bg-blue-600/10 text-white' 
                                                : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'}
                                        `}
                                    >
                                        <div className={`relative z-10 transition-colors duration-300 ${isCollapsed ? 'mx-auto' : ''}`}>
                                            <item.icon size={isCollapsed ? 22 : 20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-300" />
                                        </div>

                                        {!isCollapsed && (
                                            <span className="font-bold text-[13px] tracking-tight relative z-10">
                                                {item.label}
                                            </span>
                                        )}

                                        {/* Active State Indicator */}
                                        <NavLink to={item.to} end={item.end} className={({ isActive }) => isActive ? "absolute inset-0 rounded-2xl border border-blue-500/20 bg-blue-500/[0.02] shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]" : "hidden"} />
                                        
                                        <NavLink to={item.to} end={item.end} className={({ isActive }) => isActive ? "absolute left-[-4px] top-1/4 bottom-1/4 w-[3px] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" : "hidden"} />
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Personnel Clearance */}
                <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shrink-0">
                            <div className="w-full h-full rounded-[10px] bg-[#050505] flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm font-black text-white">{user?.name?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Authorized User</p>
                                <p className="text-sm font-bold text-white truncate leading-none">{user?.name || 'Admin User'}</p>
                            </div>
                        )}
                        {!isCollapsed && <ChevronLeft size={16} className="text-slate-600 group-hover:text-blue-500 transition-colors" />}
                    </button>
                    
                    {!isCollapsed && (
                        <div className="mt-4 flex flex-col gap-2">
                             <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-700">
                                <span>Security Level</span>
                                <span className="text-blue-500/80">Lvl_5 Alpha</span>
                             </div>
                             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
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
