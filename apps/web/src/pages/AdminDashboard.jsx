import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    Calendar, 
    Activity, 
    ArrowUpRight,
    Search,
    Cpu,
    Zap,
    Globe,
    Target,
    Database,
    Crosshair,
    TrendingUp,
    CreditCard,
    MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        activeEvents: 0,
        attendanceRate: 0,
        serverLoad: 0,
        activeSesssions: 0,
        logs: [],
        events: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ... (Keep existing data fetching logic)
                const [regRes, eventRes] = await Promise.all([
                    axios.get(`${API_URL}/admin-registrations/`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_URL}/operations/events/`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const regs = regRes.data || [];
                const events = eventRes.data || [];
                // ...
                setStats({
                    totalRegistrations: regs.length,
                    activeEvents: events.filter(e => e.is_registration_open).length,
                    attendanceRate: regs.length > 0 ? Math.round((regs.filter(r => r.is_used || r.status === 'ATTENDED').length / regs.length) * 100) : 0,
                    serverLoad: Math.floor(Math.random() * 30 + 10),
                    activeSesssions: Math.floor(Math.random() * 50 + 20),
                    logs: regs.slice(0, 8),
                    events: events.slice(0, 5)
                });
            } catch (error) {
                console.error("Dashboard Sync Failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(() => {
            setStats(prev => ({ ...prev, serverLoad: Math.floor(Math.random() * 40 + 20) }));
        }, 3000);
        return () => clearInterval(interval);
    }, [token]);

    // NeuroBank Style Card = "Obsidian Glass"
    const BentoCard = ({ children, className = "", title, action }) => (
        <div className={`relative rounded-[32px] bg-[#12121A]/60 backdrop-blur-2xl border border-white/[0.03] p-6 flex flex-col overflow-hidden ${className}`}>
            {/* Header */}
            {(title || action) && (
                <div className="flex justify-between items-center mb-4 z-10 relative">
                    {title && <h3 className="text-gray-400 font-medium text-sm tracking-wide">{title}</h3>}
                    {action}
                </div>
            )}
            <div className="relative z-10 flex-1">{children}</div>
            
            {/* Subtle Inner Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        </div>
    );

    const StatBig = ({ label, value, trend, icon: Icon, color = "text-white" }) => (
        <BentoCard>
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-gray-300">
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <TrendingUp size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 text-xs font-bold">{trend}</span>
                    </div>
                )}
            </div>
            <div>
                <h4 className="text-4xl font-bold text-white mb-2 font-inter tracking-tight">{value}</h4>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
            </div>
        </BentoCard>
    );

    return (
        <div className="min-h-full space-y-8 animate-fade-in-up pb-10 font-inter">
            
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                   <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                       Dashboard
                   </h1>
                   <p className="text-gray-500 font-medium">Overview of system performance and events.</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-11 px-5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white font-medium">
                        View Reports
                    </button>
                    <button className="h-11 px-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] transition-all text-sm text-white font-bold flex items-center gap-2">
                        <Zap size={16} fill="currentColor" />
                        Quick Action
                    </button>
                </div>
            </header>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* 1. Key Stat - Users */}
                <StatBig 
                    label="Total Operatives" 
                    value={loading ? "..." : stats.totalRegistrations} 
                    trend="+12.5%" 
                    icon={Users} 
                />

                {/* 2. Key Stat - Events */}
                <StatBig 
                    label="Active Missions" 
                    value={loading ? "..." : stats.activeEvents} 
                    trend="+2 Active" 
                    icon={Target} 
                />

                {/* 3. Spending / Load Chart Card (2x1) */}
                <BentoCard className="md:col-span-2 relative" title="System Load Analysis">
                    <div className="absolute right-6 top-6 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase font-bold text-gray-400">Daily</span>
                        <span className="px-3 py-1 rounded-full bg-blue-600 text-[10px] uppercase font-bold text-white">Live</span>
                    </div>

                    <div className="flex items-end h-32 gap-2 mt-4 px-2">
                         {/* Faux Chart Bars */}
                         {Array.from({ length: 24 }).map((_, i) => (
                             <div 
                                key={i}
                                className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-600/20 to-blue-500/80 hover:to-blue-400 transition-all opacity-80"
                                style={{ height: `${20 + Math.random() * 60}%` }}
                             />
                         ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500 font-medium px-2">
                        <span>00:00</span>
                        <span>12:00</span>
                        <span>23:59</span>
                    </div>
                </BentoCard>

                {/* 4. Portfolio / Map (2x2) */}
                <BentoCard className="lg:col-span-2 row-span-2 relative min-h-[400px]" title="Global Live Tracker">
                    <div className="absolute right-6 top-6">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-500 text-xs font-bold">Online</span>
                        </div>
                    </div>
                    
                    {/* Abstract Blue Map/Orb */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                         <div className="w-[500px] h-[500px] rounded-full border border-blue-500/10 animate-[spin_60s_linear_infinite]" />
                         <div className="absolute w-[300px] h-[300px] rounded-full border border-indigo-500/20 animate-[spin_40s_linear_infinite_reverse]" />
                         <div className="absolute w-[150px] h-[150px] bg-blue-500/20 blur-[100px]" />
                    </div>

                    {/* Overlay Stats */}
                    <div className="relative z-10 mt-10 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[#08080C]/50 border border-white/5 backdrop-blur-md">
                            <p className="text-xs text-gray-500 mb-1">Grid Coordinates</p>
                            <p className="text-white font-mono text-sm">24.551° N, 78.112° E</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#08080C]/50 border border-white/5 backdrop-blur-md">
                            <p className="text-xs text-gray-500 mb-1">Signal Strength</p>
                            <p className="text-emerald-400 font-mono text-sm">EXCELLENT (98%)</p>
                        </div>
                    </div>
                </BentoCard>

                {/* 5. Transactions / Logs List */}
                <BentoCard className="lg:col-span-2" title="Recent Activity">
                    <div className="space-y-1 mt-2">
                        {loading ? (
                            <div className="py-8 text-center text-gray-600">Syncing...</div>
                        ) : stats.logs.slice(0,4).map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/[0.03] transition-colors group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.id % 2 === 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        <Activity size={18} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">{log.user_name}</p>
                                        <p className="text-gray-500 text-xs">Auth ID: #{log.id}</p>
                                    </div>
                                </div>
                                <span className="text-gray-500 text-xs font-mono">
                                    {new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-3 rounded-xl border border-white/5 text-xs text-gray-400 font-medium hover:bg-white/5 transition-colors">
                        View All Logs
                    </button>
                </BentoCard>

                {/* 6. Quick Transfer / Action */}
                <BentoCard title="Security Level">
                    <div className="flex flex-col items-center justify-center h-full py-4">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                                <circle cx="64" cy="64" r="56" stroke="#3B82F6" strokeWidth="8" fill="transparent" strokeDasharray="351.86" strokeDashoffset={351.86 * (1 - 0.85)} strokeLinecap="round" />
                            </svg>
                            <div className="absolute text-center">
                                <span className="text-2xl font-bold text-white">85%</span>
                            </div>
                        </div>
                        <p className="text-center text-gray-400 text-xs mt-4">System integrity is high.</p>
                    </div>
                </BentoCard>
                
                {/* 7. Card */}
                <BentoCard className="bg-gradient-to-br from-blue-600 to-indigo-700 !border-0" title="">
                    <div className="h-full flex flex-col justify-between text-white">
                        <div className="flex justify-between items-start">
                             <CreditCard size={24} className="opacity-80" />
                             <MoreHorizontal size={20} className="opacity-60" />
                        </div>
                        <div>
                             <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Master Access</p>
                             <p className="text-lg font-mono tracking-widest">**** **** 4242</p>
                        </div>
                    </div>
                </BentoCard>

            </div>
        </div>
    );
};

export default AdminDashboard;
