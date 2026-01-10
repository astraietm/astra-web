import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    Bell, 
    Search, 
    ShieldCheck, 
    User,
    Circle,
    LogOut,
    Menu,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeader = ({ title, onMenuClick, isSystemOnline, onSearchClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Ctrl+K handled by AdminLayout now

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
                <h2 className="text-white font-semibold text-lg uppercase tracking-tight">
                    {title || "Dashboard"}
                </h2>
                <div className="h-4 w-px bg-border hidden sm:block"></div>
                <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isSystemOnline 
                    ? 'text-emerald-400 bg-emerald-400/5 border border-emerald-400/20' 
                    : 'text-rose-400 bg-rose-400/5 border border-rose-400/20'
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isSystemOnline ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`}></div>
                    <span>{isSystemOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}</span>
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4">
                {/* Global Search */}
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-vision-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search... (Ctrl+K)"
                        onClick={onSearchClick}
                        readOnly
                        className="bg-white/5 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-vision-primary/50 w-64 transition-all placeholder:text-gray-500 hover:bg-white/10 cursor-text"
                    />
                </div>

                {/* Notifications */}
                <button className="relative w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border">
                    <div className="relative group">
                        <button className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                            <User className="w-5 h-5" />
                        </button>
                        
                        {/* Dropdown Menu */}

                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
