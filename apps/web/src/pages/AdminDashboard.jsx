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
    MoreHorizontal,
    Settings
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
        activeSessions: 0,
        logs: [],
        events: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [regRes, eventRes] = await Promise.all([
                    axios.get(`${API_URL}/admin-registrations/`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API_URL}/operations/events/`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                const regs = regRes.data || [];
                const events = eventRes.data || [];
                
                setStats({
                    totalRegistrations: regs.length,
                    activeEvents: events.filter(e => e.is_registration_open).length,
                    attendanceRate: regs.length > 0 ? Math.round((regs.filter(r => r.is_used || r.status === 'ATTENDED').length / regs.length) * 100) : 0,
                    serverLoad: Math.floor(Math.random() * 30 + 10),
                    activeSessions: Math.floor(Math.random() * 50 + 20),
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
        }, 5000);
        return () => clearInterval(interval);
    }, [token]);

    const StatCard = ({ label, value, trend, icon: Icon, color = 'blue' }) => {
        const borderColors = {
            blue: 'border-blue-500/30 bg-blue-500/5',
            emerald: 'border-emerald-500/30 bg-emerald-500/5',
            purple: 'border-purple-500/30 bg-purple-500/5',
            amber: 'border-amber-500/30 bg-amber-500/5',
        };

        return (
            <motion.div 
                whileHover={{ y: -8, scale: 1.01 }}
                className={`p-10 rounded-[3rem] border backdrop-blur-3xl relative overflow-hidden group transition-all duration-500 ${borderColors[color]} border-white/5 bg-[#050505]/40`}
            >
                <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-20 transition-all duration-700 group-hover:rotate-12">
                    <Icon size={160} strokeWidth={1} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between gap-10">
                    <div className="flex justify-between items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 text-white group-hover:scale-110 transition-transform`}>
                            <Icon size={24} strokeWidth={2.5} />
                        </div>
                        {trend && (
                            <span className="text-[10px] font-black px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center gap-2 backdrop-blur-md">
                                <TrendingUp size={12} className="text-emerald-500" /> {trend}
                            </span>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">{label}</div>
                        <h3 className="text-5xl font-black text-white tracking-tighter leading-none">
                            {loading ? <span className="animate-pulse">---</span> : value}
                        </h3>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-16 pb-32 font-inter">
            {/* Mission Critical Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[2px] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Live Operations Active</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter leading-none uppercase">Tactical Oversight</h1>
                    <p className="text-slate-500 text-sm font-medium max-w-lg">Advanced telemetry protocols monitoring real-time user interaction across the Astra ecosystem.</p>
                </div>
                
                <div className="flex gap-4">
                    <button className="h-16 px-10 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all">
                        Registry Export
                    </button>
                    <button className="h-16 px-10 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center gap-3">
                        <Zap size={18} fill="white" className="animate-pulse" /> Dispatch Order
                    </button>
                </div>
            </div>

            {/* Core Diagnostics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard label="Network Population" value={stats.totalRegistrations} trend="+12.5%" icon={Users} color="blue" />
                <StatCard label="Live Protocols" value={stats.activeEvents} trend="Active Now" icon={Calendar} color="purple" />
                <StatCard label="Sync Precision" value={`${stats.attendanceRate}%`} trend="+5.2%" icon={Target} color="emerald" />
                <StatCard label="Node Integrity" value="CRITICAL" trend="V0.1 Alpha" icon={Activity} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Spectral Traffic Mapping */}
                <div className="lg:col-span-8 bg-[#050505]/60 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-12 flex flex-col shadow-inner">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                         <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Spectral Analysis</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Integrated Global interaction telemetry</p>
                         </div>
                         <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                             <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Real-time Feed</button>
                             <button className="px-6 py-2.5 rounded-xl text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Archived Logs</button>
                         </div>
                    </div>
                    
                    <div className="flex-1 flex items-end justify-between gap-6 min-h-[350px] border-b border-white/5 pb-10">
                        {Array.from({ length: 18 }).map((_, i) => (
                             <div key={i} className="flex-1 bg-white/[0.01] rounded-2xl relative group h-full transition-all duration-500 hover:bg-white/[0.03]">
                                 <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.random() * 80 + 10}%` }}
                                    transition={{ duration: 2, ease: [0.19, 1, 0.22, 1], delay: i * 0.05 }}
                                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-600 to-blue-400/[0.05] rounded-t-2xl border-t border-blue-400/50 group-hover:from-blue-500 transition-all duration-700 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                                 />
                                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-blue-400 shadow-2xl scale-75 group-hover:scale-100">
                                     {Math.floor(Math.random() * 800 + 100)} OPS
                                 </div>
                             </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-8 text-[10px] text-slate-700 font-black uppercase tracking-[0.4em]">
                        <span>Sector A1</span><span>Sector B4</span><span>Sector C2</span><span>Sector D9</span><span>Sector E5</span><span>Sector F3</span>
                    </div>
                </div>

                {/* Operations Telemetry */}
                <div className="lg:col-span-4 bg-[#050505]/60 backdrop-blur-3xl rounded-[3rem] border border-white/5 flex flex-col overflow-hidden shadow-inner">
                    <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Protocol Logs</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Live Identity Verification</p>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping shadow-[0_0_15px_rgba(59,130,246,1)]" />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <Loader2 className="text-blue-500 animate-spin w-10 h-10" />
                            </div>
                        ) : stats.logs.map((log, i) => (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={i} 
                                className="flex gap-4 items-center group p-5 rounded-[1.8rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-blue-500/50 transition-colors">
                                    <span className="text-sm font-black text-white">{log.user_name?.[0].toUpperCase()}</span>
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className="text-sm font-black text-white truncate leading-none mb-1 group-hover:text-blue-400 transition-colors uppercase">{log.user_name}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate">
                                            Handshake Verified • {new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="p-8 bg-white/[0.01]">
                        <button className="w-full h-14 rounded-2xl border border-white/5 hover:border-blue-500/30 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] transition-all text-center backdrop-blur-md">
                            Clear Command Cache
                        </button>
                    </div>
                </div>
            </div>
            
             {/* Integrated Protocol Nodes */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { title: 'Sector Entry', desc: 'Secure new node creation', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { title: 'Population Control', desc: 'Registry & Permission Access', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { title: 'System Core', desc: 'Deep server parameters', icon: Settings, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map((action, i) => (
                    <motion.button 
                        whileHover={{ scale: 1.05, border: '1px solid rgba(59, 130, 246, 0.4)' }}
                        key={i} 
                        className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-[#050505]/60 backdrop-blur-3xl border border-white/5 transition-all text-left shadow-xl group"
                    >
                         <div className={`w-16 h-16 rounded-2xl ${action.bg} ${action.color} border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                             <action.icon size={28} strokeWidth={2.5} />
                         </div>
                         <div className="flex-1 space-y-1">
                             <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">{action.desc}</div>
                             <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-none">{action.title}</h4>
                         </div>
                         <ArrowUpRight className="text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={24} />
                    </motion.button>
                ))}
             </div>
        </div>
    );
};

export default AdminDashboard;
