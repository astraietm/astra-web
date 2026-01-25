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
    
    return (
        <header className="h-24 bg-slate-950/40 backdrop-blur-2xl border-b border-white/[0.08] sticky top-0 z-[90] flex items-center justify-between px-10 relative overflow-hidden">
            {/* Header Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-blue-600/5 pointer-events-none" />
            
            {/* Left Section */}
            <div className="flex items-center gap-8 relative z-10">
                <button 
                    onClick={onMenuClick}
                    className="p-3.5 bg-white/[0.05] border border-white/[0.08] rounded-2xl lg:hidden text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-gradient-to-r from-violet-500/50 to-transparent" />
                        <span className="text-[10px] font-bold text-violet-400/80 uppercase tracking-[0.2em] leading-none">Current View</span>
                    </div>
                    <h2 className="text-white font-black text-2xl uppercase tracking-tight leading-none">
                        {title || "Dashboard"}
                    </h2>
                </div>

                <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2 hidden sm:block" />

                <div className={`hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[10px] font-bold tracking-wider transition-all border backdrop-blur-xl ${
                    isSystemOnline 
                    ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-lg shadow-emerald-400/10' 
                    : 'text-rose-400 bg-rose-400/10 border-rose-400/20 shadow-lg shadow-rose-400/10'
                }`}>
                    <div className="relative">
                        <div className={`w-2.5 h-2.5 rounded-full ${isSystemOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}>
                            <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${isSystemOnline ? 'bg-emerald-400' : 'bg-rose-400'} animate-ping opacity-75`}></div>
                        </div>
                    </div>
                    <span className="uppercase">{isSystemOnline ? 'System Online' : 'System Offline'}</span>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6 relative z-10">
                {/* Enhanced Search Bar */}
                <div className="relative hidden lg:block group">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors duration-300 z-10" />
                    <input 
                        type="text" 
                        placeholder="Search system... (Ctrl+K)"
                        onClick={onSearchClick}
                        readOnly
                        className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl py-3.5 pl-14 pr-24 text-sm font-medium w-96 transition-all duration-300 focus:outline-none focus:border-violet-500/30 focus:bg-white/[0.06] placeholder:text-slate-600 hover:bg-white/[0.06] hover:border-white/[0.12] cursor-pointer tracking-tight"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <kbd className="text-[9px] font-bold text-slate-500 uppercase">Ctrl</kbd>
                        <span className="text-slate-600">+</span>
                        <kbd className="text-[9px] font-bold text-slate-500 uppercase">K</kbd>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300 group">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-violet-500 rounded-full shadow-lg shadow-violet-500/50">
                            <span className="absolute inset-0 bg-violet-500 rounded-full animate-ping opacity-75" />
                        </span>
                    </button>

                    <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent mx-1" />

                    {/* User Profile */}
                    <button className="flex items-center gap-4 pl-2 pr-5 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group">
                        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 p-[2px]">
                            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center overflow-hidden">
                                <ShieldCheck className="w-5 h-5 text-violet-400" />
                            </div>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                        </div>
                        <div className="hidden md:block text-left">
                            <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none mb-1">Admin</div>
                            <div className="text-[12px] font-bold text-white uppercase tracking-tight leading-none">System</div>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
