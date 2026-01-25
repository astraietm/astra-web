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
    HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHeader = ({ title, onMenuClick, isSystemOnline, onSearchClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-[90] flex items-center justify-between px-6">
            {/* Left Section */}
            <div className="flex items-center gap-6">
                <button 
                    onClick={onMenuClick}
                    className="p-2 lg:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold text-slate-900">
                        {title || "Dashboard"}
                    </h1>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search..."
                        onClick={onSearchClick}
                        readOnly
                        className="bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm w-80 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 hover:bg-slate-100 cursor-pointer"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-1 text-[11px] text-slate-400">
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium">⌘</kbd>
                        <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-medium">K</kbd>
                    </div>
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
                </button>

                {/* Help */}
                <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all hidden sm:block">
                    <HelpCircle className="w-5 h-5" />
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1" />

                {/* User Menu */}
                <button className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-all">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                        {user?.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-[13px] font-medium text-slate-900 leading-tight">{user?.name || 'Admin'}</p>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
