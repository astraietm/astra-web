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

const AdminHeader = ({ title }) => {
    const { user, logout } = useAuth();

    return (
        <header className="h-20 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[90] flex items-center justify-between px-8">
            {/* Page Context */}
            <div className="flex items-center gap-4">
                <h2 className="text-white font-display font-medium text-lg tracking-wide uppercase">
                    {title || "Admin Console"}
                </h2>
                <div className="h-4 w-px bg-white/10 hidden md:block"></div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-6">
                {/* Global Search Placeholder */}
                <div className="relative hidden lg:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search system..."
                        className="bg-white/5 border border-white/5 rounded-lg py-2 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-primary/30 w-64 transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all group">
                    <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#0A0A0B]"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-4 pl-4 border-l border-white/5">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-white tracking-wide">{user?.user_name || "Admin"}</span>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                {user?.is_superuser ? "Super Admin" : "Operator"}
                            </span>
                        </div>
                    </div>
                    <div className="relative group">
                        <button className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary group-hover:border-primary/50 transition-all">
                            <User className="w-6 h-6" />
                        </button>
                        
                        {/* Dropdown Menu (Simplified) */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F0F11] border border-white/5 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all p-2 z-[100]">
                            <button 
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
