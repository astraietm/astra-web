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
    ArrowLeft
} from 'lucide-react';

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
                className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 z-[100] transition-all duration-300 flex flex-col
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Header branding */}
                <div className="h-16 flex items-center px-5 border-b border-slate-800 shrink-0">
                    <button 
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-3 w-full group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 group-hover:bg-blue-500 transition-colors">
                            <Shield size={20} className="fill-white" />
                        </div>
                        
                        {!isCollapsed && (
                            <span className="font-semibold text-slate-100 text-[15px]">
                                Astra
                            </span>
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3">
                    {sections.map((section, idx) => (
                        <div key={idx} className="mb-6">
                            {!isCollapsed && (
                                <div className="px-3 mb-2">
                                    <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                        {section.group}
                                    </h3>
                                </div>
                            )}
                            <div className="space-y-0.5">
                                {section.items.map((item, i) => (
                                    <NavLink
                                        key={i}
                                        to={item.to}
                                        end={item.end}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group relative
                                            ${isActive 
                                                ? 'bg-slate-800 text-slate-100 font-medium' 
                                                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
                                        `}
                                    >
                                        <div className={`transition-colors ${isCollapsed ? 'mx-auto' : ''}`}>
                                            <item.icon size={20} strokeWidth={2} />
                                        </div>

                                        {!isCollapsed && (
                                            <span className="text-[14px]">
                                                {item.label}
                                            </span>
                                        )}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Profile */}
                <div className="p-3 border-t border-slate-800">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 transition-all duration-150 group ${isCollapsed ? 'justify-center' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 shrink-0 font-semibold text-sm border border-blue-500/20">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="User" />
                            ) : (
                                <span>{user?.name?.[0]?.toUpperCase()}</span>
                            )}
                        </div>
                        
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-[13px] font-medium text-slate-100 truncate leading-tight">{user?.name || 'Admin'}</p>
                                    <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">Administrator</p>
                                </div>
                                <ChevronLeft size={16} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                            </>
                        )}
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default AdminSidebar;
