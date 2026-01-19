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
                flex items-center gap-3 px-4 py-3 my-1 rounded-xl transition-all duration-300 group
                ${isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_20px_-4px_rgba(37,99,235,0.5)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
            `}
        >
            <div className="relative z-10">
                <Icon size={isCollapsed ? 22 : 20} strokeWidth={2} />
            </div>

            {!isCollapsed && (
                <span className="font-medium text-sm font-inter tracking-wide relative z-10">
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
                    width: isCollapsed ? 80 : 260,
                    x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
                }}
                className={`fixed left-4 top-4 bottom-4 rounded-[32px] z-[100] transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) flex flex-col overflow-hidden
                    bg-[#0C0C12]/90 backdrop-blur-2xl border border-white/5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header */}
                <div className="p-8 pb-4 relative shrink-0 flex items-center justify-center">
                    <button 
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 w-full group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="relative w-10 h-10 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <span className="font-bold text-lg font-inter">A</span>
                        </div>
                        
                        {!isCollapsed && (
                             <div className="flex flex-col items-start overflow-hidden">
                                <span className="font-bold text-lg text-white tracking-tight">ASTRA<span className="text-blue-500">.OS</span></span>
                                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Admin Panel</span>
                            </div>
                        )}
                    </button>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4 space-y-6 custom-scrollbar">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-1">
                             {!isCollapsed && (
                                <h3 className="px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 font-inter">
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
                <div className="p-6 relative shrink-0 border-t border-white/5 bg-white/[0.01]">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-800 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm font-bold text-white">{user?.name?.[0]}</span>
                            )}
                        </div>
                        
                        {!isCollapsed && (
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="text-sm font-semibold text-white truncate font-inter">{user?.name || 'Commander'}</p>
                                <p className="text-[11px] text-gray-400">View Profile</p>
                            </div>
                        )}
                        {!isCollapsed && <ChevronLeft size={16} className="text-gray-500 group-hover:text-white transition-colors" />}
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
