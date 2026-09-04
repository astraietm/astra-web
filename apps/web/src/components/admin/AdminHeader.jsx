import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    Search, 
    Menu, 
    Bell,
    Plus,
    QrCode,
    Settings,
    LogOut,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    User
} from 'lucide-react';

const AdminHeader = ({ onMenuClick, onSearchClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get clean title for current path
    const getBreadcrumbs = () => {
        const path = location.pathname.replace('/admin', '').replace('/', '');
        if (!path) return 'Overview';
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logout();
            navigate('/');
        }
    };

    return (
        <header className="h-16 bg-[#0A0C11] border-b border-white/[0.08] sticky top-0 z-[90] flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
            {/* Left Section: Brand & Breadcrumb */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="p-2 bg-white/[0.03] border border-white/[0.08] rounded-xl lg:hidden text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                    aria-label="Toggle navigation menu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                    <Link to="/admin" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center p-1 shadow-sm shadow-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                            <img src="/astra-logo.svg" alt="ASTRA" className="w-full h-full object-contain" />
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-sm font-bold tracking-wider text-white uppercase">ASTRA</span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wide">
                                Admin
                            </span>
                        </div>
                    </Link>

                    {/* Breadcrumb separator */}
                    <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/[0.08] text-xs font-medium text-slate-400">
                        <span>Admin</span>
                        <ChevronRight size={12} className="text-slate-400" />
                        <span className="text-slate-200 font-semibold">{getBreadcrumbs()}</span>
                    </div>
                </div>
            </div>

            {/* Center Section: Global Search */}
            <div className="flex-1 max-w-md mx-6 hidden md:block">
                <button 
                    onClick={onSearchClick}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#111319] border border-white/[0.08] hover:border-white/[0.2] text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer shadow-sm group"
                >
                    <div className="flex items-center gap-2.5">
                        <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <span>Search events, attendees, commands...</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.1] rounded text-[10px] font-mono text-slate-300">
                        Ctrl K
                    </kbd>
                </button>
            </div>

            {/* Right Section: Actions & User Menu */}
            <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Mobile Search Button */}
                <button
                    onClick={onSearchClick}
                    className="p-2 md:hidden rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
                    aria-label="Search"
                >
                    <Search className="w-4 h-4" />
                </button>

                {/* Quick Action: New Event */}
                <button
                    onClick={() => navigate('/admin/events')}
                    className="hidden sm:flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Event</span>
                </button>

                {/* Scanner Shortcut */}
                <button
                    onClick={() => navigate('/admin/scanner')}
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                    title="Ticket Scanner"
                >
                    <QrCode className="w-4 h-4" />
                </button>

                {/* Notifications Link */}
                <button
                    onClick={() => navigate('/admin/notifications')}
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors relative"
                    title="Communications & Announcements"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#0A0C11]" />
                </button>

                <div className="h-5 w-px bg-white/[0.08] hidden sm:block mx-1" />

                {/* Admin User Menu Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(prev => !prev)}
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-colors"
                        aria-expanded={dropdownOpen}
                    >
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 overflow-hidden shrink-0">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt="User avatar" />
                            ) : (
                                user?.name?.[0]?.toUpperCase() || user?.first_name?.[0]?.toUpperCase() || 'A'
                            )}
                        </div>
                        <div className="hidden lg:flex flex-col text-left">
                            <span className="text-xs font-semibold text-white leading-none truncate max-w-[120px]">
                                {user?.name || user?.first_name || 'Admin'}
                            </span>
                            <span className="text-[10px] text-slate-400 leading-tight mt-0.5">
                                Administrator
                            </span>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-[#0E1017] border border-white/[0.1] rounded-2xl shadow-xl p-1.5 z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@astra.edu'}</p>
                            </div>

                            <button
                                onClick={() => { setDropdownOpen(false); navigate('/admin/settings'); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors text-left"
                            >
                                <Settings size={14} className="text-slate-400" />
                                <span>Platform Settings</span>
                            </button>

                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setDropdownOpen(false)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors text-left"
                            >
                                <ExternalLink size={14} className="text-slate-400" />
                                <span>View Public Site</span>
                            </a>

                            <div className="my-1 border-t border-white/[0.06]" />

                            <button
                                onClick={() => { setDropdownOpen(false); handleLogout(); }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left"
                            >
                                <LogOut size={14} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
