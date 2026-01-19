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
                    width: isCollapsed ? 72 : 260,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
                }}
                className={`fixed left-0 top-0 h-screen bg-[#0f172a] border-r border-slate-800 z-[100] transition-all duration-300 flex flex-col
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 shrink-0">
                    <button 
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 w-full group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                            <span className="font-bold text-sm">A</span>
                        </div>
                        
                        {!isCollapsed && (
                             <span className="font-bold text-white tracking-tight">Astra<span className="text-slate-500">Panel</span></span>
                        )}
                    </button>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-8 custom-scrollbar">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-1">
                             {!isCollapsed && (
                                <h3 className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 font-inter">
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
                <div className="p-4 border-t border-slate-800 bg-[#020617]/50">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-all ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden text-white border border-slate-600">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold text-slate-300">{user?.name?.[0]}</span>
                            )}
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-sm font-medium text-slate-200 truncate">{user?.name || 'Admin User'}</p>
                                <p className="text-[11px] text-slate-500">View Profile</p>
                            </div>
                        )}
                        {!isCollapsed && <ChevronLeft size={14} className="text-slate-500" />}
                    </button>
                    
                    {/* Access Level Badge */}
                    {!isCollapsed && <div className="mt-3 text-[10px] text-center text-slate-600 font-medium">SYS_ADMIN_ACCESS_Lvl_5</div>}
                </div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
