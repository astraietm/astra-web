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
        <header className="h-20 bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-[90] flex items-center justify-between px-8">
            {/* Context & System Status */}
            <div className="flex items-center gap-6">
                <button 
                    onClick={onMenuClick}
                    className="p-3 -ml-2 bg-white/5 border border-white/5 rounded-xl lg:hidden text-gray-400 hover:text-white transition-all hover:scale-105 active:scale-95"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] leading-none mb-1">Navigation</span>
                        <div className="h-px w-8 bg-blue-500/20" />
                    </div>
                    <h2 className="text-white font-black text-xl uppercase tracking-tighter leading-none">
                        {title || "Command Center"}
                    </h2>
                </div>

                <div className="h-8 w-px bg-white/5 mx-2 hidden sm:block" />

                <div className={`hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all border ${
                    isSystemOnline 
                    ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
                    : 'text-rose-400 bg-rose-400/5 border-rose-400/10 shadow-[0_0_15px_rgba(244,63,94,0.05)]'
                }`}>
                    <div className="relative">
                        <div className={`w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-500' : 'bg-rose-400'} animate-pulse`}></div>
                        <div className={`absolute inset-0 w-2 h-2 rounded-full ${isSystemOnline ? 'bg-emerald-500' : 'bg-rose-400'} blur-sm animate-ping opacity-50`}></div>
                    </div>
                    <span>{isSystemOnline ? 'UPLINK_SECURE' : 'UPLINK_DOWN'}</span>
                </div>
            </div>

            {/* Tactical Actions */}
            <div className="flex items-center gap-6">
                {/* Global Query Input */}
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors duration-300" />
                    <input 
                        type="text" 
                        placeholder="Search system nodes... (Ctrl+K)"
                        onClick={onSearchClick}
                        readOnly
                        className="bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold w-72 transition-all duration-300 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.05] placeholder:text-slate-600 hover:bg-white/[0.05] cursor-pointer tracking-tight"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-slate-600 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                        Ctrl+K
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Alerts Hub */}
                    <button className="relative w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-blue-500/20 transition-all duration-300">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,1)]"></span>
                    </button>

                    <div className="h-8 w-px bg-white/5 mx-2" />

                    {/* Quick Access */}
                    <button className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                        <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="hidden md:block text-left">
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Identity</div>
                            <div className="text-[11px] font-bold text-white uppercase tracking-tight leading-none">Root</div>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
