import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    Bell, 
    Search, 
    ShieldCheck, 
    User,
    Circle,
    LogOut,
    Menu
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeader = ({ title, onMenuClick, isSystemOnline }) => {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-border sticky top-0 z-[90] flex items-center justify-between px-6">
            {/* Page Context */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="p-2 -ml-2 hover:bg-white/5 rounded-lg lg:hidden text-gray-400 hover:text-white transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-white font-semibold text-lg">
                    {title || "Dashboard"}
                </h2>
                <div className="h-4 w-px bg-border hidden sm:block"></div>
                <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isSystemOnline 
                    ? 'text-emerald-400' 
                    : 'text-rose-400'
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isSystemOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                    <span>{isSystemOnline ? 'Online' : 'Offline'}</span>
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4">
                {/* Global Search */}
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search or press Ctrl+K"
                        className="bg-white/5 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 w-64 transition-colors placeholder:text-gray-500"
                    />
                </div>

                {/* Notifications */}
                <button className="relative w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-medium text-white">{user?.user_name || "Admin"}</span>
                        <span className="text-xs text-gray-500">
                            {user?.is_superuser ? "Administrator" : "User"}
                        </span>
                    </div>
                    <div className="relative group">
                        <button className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                            <User className="w-5 h-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full pt-2 w-48 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-[100]">
                            <div className="bg-surface border border-border rounded-lg shadow-xl p-2">
                                <button 
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
