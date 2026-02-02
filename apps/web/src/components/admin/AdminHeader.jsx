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
    ArrowLeft,
    Settings,
    HelpCircle,
    Globe,
    Zap,
    Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeader = ({ title, onMenuClick, isSystemOnline, onSearchClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    return (
        <header className="h-20 bg-black/40 backdrop-blur-2xl border-b border-white/[0.04] sticky top-0 z-[90] flex items-center justify-between px-10 relative overflow-hidden">
            {/* Header Glow Decor */}
            <div className="absolute top-0 right-1/4 w-64 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            
            {/* Left Section: Breadcrumb / Identity */}
            <div className="flex items-center gap-8 relative z-10">
                <button 
                    onClick={onMenuClick}
                    className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl lg:hidden text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] leading-none mb-1">Navigation</span>
                        <div className="h-px w-8 bg-blue-500/20" />
                    </div>
                    <h2 className="text-white font-black text-xl uppercase tracking-widest leading-none">
                        {title || "Astra Admin"}
                    </h2>
                </div>

                <div className="h-10 w-px bg-white/[0.04] mx-2 hidden md:block" />

                {/* Status */}
                <div className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05] transition-all duration-500`}>
                    <div className="relative">
                        <div className={`w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <div className={`absolute inset-0 w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-500' : 'bg-red-500'} blur-sm animate-ping opacity-40`} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSystemOnline ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                        {isSystemOnline ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
            </div>

            {/* Right Section: System Tools & Profile */}
            <div className="flex items-center gap-8 relative z-10">
                {/* Global Search Bar */}
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
                    <input 
                        type="text" 
                        placeholder="SEARCH... (CTRL+K)"
                        onClick={onSearchClick}
                        readOnly
                        className="bg-white/[0.02] border border-white/[0.06] rounded-2xl py-3 pl-12 pr-28 text-[11px] font-black w-80 transition-all focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:bg-white/[0.04] placeholder:text-slate-700 hover:bg-white/[0.04] hover:border-white/[0.1] cursor-pointer text-slate-300 uppercase tracking-widest"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <kbd className="px-1.5 py-0.5 bg-white/[0.05] border border-white/[0.05] rounded-md text-[9px] font-black text-slate-500">CTRL</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white/[0.05] border border-white/[0.05] rounded-md text-[9px] font-black text-slate-500">K</kbd>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Alerts Hub */}
                    <button className="relative w-11 h-11 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all hover:scale-105 active:scale-95 group">
                        <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,1)]"></span>
                    </button>

                    <div className="h-10 w-px bg-white/[0.04] mx-1 hidden sm:block" />

                    {/* Personnel Credential */}
                    <button className="flex items-center gap-4 pl-2 pr-5 py-2 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group">
                        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-[1px] border border-white/10 group-hover:border-blue-500/30 transition-colors">
                            <div className="w-full h-full rounded-[10px] bg-black flex items-center justify-center overflow-hidden">
                                <User className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Access Profile</p>
                            <p className="text-[12px] font-black text-slate-300 uppercase leading-none tracking-tight">{user?.first_name || 'Admin'}</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
