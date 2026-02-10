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
    Cpu,
    Command,
    Terminal,
    Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeader = ({ title, onMenuClick, isSystemOnline, onSearchClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    return (
        <header className="h-20 bg-black/10 backdrop-blur-3xl border-b border-white/[0.03] sticky top-0 z-[90] flex items-center justify-between px-10 relative overflow-hidden shrink-0">
            {/* Header Ambient Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            
            {/* Left Section: Context */}
            <div className="flex items-center gap-10 relative z-10">
                <button 
                    onClick={onMenuClick}
                    className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-[1.25rem] lg:hidden text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>
 
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-[0.6em] leading-none">Sector_ID</span>
                    </div>
                    <h2 className="text-white font-black text-[13px] uppercase tracking-[0.2em] mt-2 flex items-center gap-3">
                        {title || "Overview"}
                        <span className="text-white/10 text-[10px] font-thin">/</span>
                        <span className="text-white/30 text-[9px] font-mono tracking-widest lowercase">system.core.{title?.toLowerCase().replace(/\s+/g, '_') || 'dashboard'}</span>
                    </h2>
                </div>
 
                <div className="h-10 w-px bg-white/[0.03] mx-2 hidden xl:block" />
 
                {/* Visual Status Node */}
                <div className="hidden xl:flex items-center gap-4 group cursor-default">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-xl bg-white/[0.02] border border-white/[0.03] group-hover:bg-white/[0.05] transition-all" />
                        <div className={`w-1.5 h-1.5 rounded-full ${isSystemOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'} relative z-10`} />
                        <div className={`absolute inset-3 rounded-full ${isSystemOnline ? 'bg-emerald-500/20' : 'bg-rose-500/20'} animate-ping opacity-40`} />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[9px] font-black tracking-[0.3em] ${isSystemOnline ? 'text-emerald-500/80' : 'text-rose-500/80'}`}>
                            {isSystemOnline ? 'LINK_ESTABLISHED' : 'LINK_INTERRUPTED'}
                        </span>
                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em] mt-0.5">Primary_Hub_01</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Core Utility */}
            <div className="flex items-center gap-10 relative z-10">
                {/* Spotlight Search Proxy */}
                <div className="relative hidden lg:block group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-colors z-10" />
                    <input 
                        type="text" 
                        placeholder="INITIATE_CORE_SEARCH..."
                        onClick={onSearchClick}
                        readOnly
                        className="bg-white/[0.01] border border-white/[0.05] rounded-[1.25rem] h-12 pl-12 pr-28 text-[9px] font-black w-80 transition-all focus:outline-none focus:bg-white/[0.03] placeholder:text-slate-900 hover:bg-white/[0.02] hover:border-white/[0.08] cursor-pointer text-slate-400 uppercase tracking-[0.3em]"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-20 group-hover:opacity-80 transition-opacity">
                        <kbd className="px-2 py-1 bg-white/[0.05] border border-white/[0.1] rounded-lg text-[8px] font-black text-slate-500">CTRL</kbd>
                        <kbd className="px-2 py-1 bg-white/[0.05] border border-white/[0.1] rounded-lg text-[8px] font-black text-slate-500">K</kbd>
                    </div>
                </div>
 
                <div className="flex items-center gap-6">
                    {/* Signal Cluster */}
                    <div className="flex items-center bg-white/[0.02] border border-white/[0.05] rounded-[1.25rem] p-1.5 gap-1.5">
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-blue-500 hover:bg-blue-500/5 transition-all relative group/btn">
                            <Bell className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(37,99,235,1)]"></span>
                        </button>
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-white hover:bg-white/[0.05] transition-all group/btn">
                            <Terminal className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-700 hover:text-white hover:bg-white/[0.05] transition-all group/btn">
                            <Settings className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                    </div>
 
                    <div className="h-10 w-px bg-white/[0.03] mx-2 hidden sm:block" />
 
                    {/* Access Key */}
                    <button className="flex items-center gap-4 pl-1.5 pr-6 py-1.5 rounded-[1.25rem] bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/20 hover:bg-white/[0.04] transition-all group">
                        <div className="relative w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center overflow-hidden transition-all group-hover:scale-105">
                            <User className="w-4 h-4 text-blue-500" />
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500/20" />
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1 group-hover/item:text-blue-500 transition-colors">{user?.first_name || 'OPERATOR'}</p>
                            <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em] leading-none">Clearance_Level_A</p>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
