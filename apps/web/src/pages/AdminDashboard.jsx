import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    Calendar, 
    Activity, 
    ArrowUpRight,
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    Loader2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Zap,
    Cpu,
    Globe,
    Target,
    Database,
    Shield
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
        recentActivity: []
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
                
                const attended = regs.filter(r => r.is_used || r.status === 'ATTENDED').length;
                const activeEventsCount = events.filter(e => e.is_registration_open).length;

                setStats({
                    totalRegistrations: regs.length,
                    activeEvents: activeEventsCount,
                    attendanceRate: regs.length > 0 ? Math.round((attended / regs.length) * 100) : 0,
                    recentActivity: regs.slice(0, 5)
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token]);

    const statCards = [
        {
            title: 'NETWORK POPULATION',
            value: stats.totalRegistrations,
            change: '+12.5%',
            trend: 'up',
            icon: Users,
            color: 'blue',
            glow: 'rgba(37,99,235,0.4)'
        },
        {
            title: 'LIVE PROTOCOLS',
            value: stats.activeEvents,
            change: '+3',
            trend: 'up',
            icon: Cpu,
            color: 'violet',
            glow: 'rgba(124,58,237,0.4)'
        },
        {
            title: 'SYNC PRECISION',
            value: `${stats.attendanceRate}%`,
            change: '+5.2%',
            trend: 'up',
            icon: Activity,
            color: 'emerald',
            glow: 'rgba(16,185,129,0.4)'
        },
        {
            title: 'NODE INTEGRITY',
            value: 'CRITICAL',
            change: 'V8.1 Alpha',
            trend: 'none',
            icon: Shield,
            color: 'amber',
            glow: 'rgba(245,158,11,0.4)'
        }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <span className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">INITIALIZING_TERMINAL</span>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header / Tactical Overview */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Live Operations Active</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Tactical Oversight</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Command Center</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Advanced telemetry protocols monitoring real-time user interaction across the Astra ecosystem.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex flex-col items-end mr-4">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Registry Export</span>
                      <span className="text-[9px] font-medium text-slate-700 uppercase tracking-tighter">Authorized Personal Only</span>
                   </div>
                    <button className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="relative px-8 py-4 bg-blue-600 rounded-2xl flex items-center gap-3 border border-white/10 group-active:scale-95 transition-transform">
                            <Zap className="w-4 h-4 text-white fill-white animate-pulse" />
                            <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Dispatch Order</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Stats Grid - High-End Tactile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
                        className="relative group h-48"
                    >
                        <div className="absolute inset-0 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] transition-all duration-500 group-hover:bg-white/[0.04] group-hover:border-white/[0.1] shadow-2xl" />
                        <div className="absolute inset-0 rounded-[2rem] transition-opacity duration-700 opacity-0 group-hover:opacity-100" 
                             style={{ background: `radial-gradient(400px circle at 50% 50%, ${stat.glow}, transparent 80%)` }} />
                        
                        <div className="relative p-8 h-full flex flex-col justify-between z-10">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-white/[0.03] border border-white/[0.05] rounded-xl group-hover:scale-110 group-hover:border-white/15 transition-all duration-500">
                                    <stat.icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" strokeWidth={1.5} />
                                </div>
                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[9px] font-black uppercase tracking-widest ${
                                    stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'none' ? 'text-amber-500' : 'text-red-500'
                                }`}>
                                    {stat.trend === 'up' && <TrendingUp size={10} />}
                                    {stat.trend === 'none' && <Shield size={10} />}
                                    {stat.change}
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 group-hover:text-slate-400 transition-colors">{stat.title}</p>
                                <p className="text-4xl font-black text-white uppercase tracking-tighter group-hover:scale-105 origin-left transition-transform duration-500">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Operational Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Advanced Analytics Chart */}
                <div className="lg:col-span-2 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] backdrop-blur-3xl" />
                    <div className="relative p-10 h-full min-h-[450px] flex flex-col">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Spectral Analysis</h3>
                                <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.5em] mt-1">Integrated Neural Interaction Telemetry</p>
                            </div>
                            <div className="flex items-center gap-4 p-1 rounded-2xl bg-black/40 border border-white/[0.04]">
                                <button className="px-5 py-2.5 bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20">Real-Time Feed</button>
                                <button className="px-5 py-2.5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Archived Logs</button>
                            </div>
                        </div>
                        
                        <div className="flex-1 flex items-end justify-between gap-6 pb-4">
                            {[20, 60, 40, 95, 30, 80, 50, 90, 35, 75, 45, 100].map((height, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-6 group/bar">
                                    <div className="relative w-full flex flex-col items-center">
                                         <div className="absolute bottom-full mb-3 px-2 py-1 bg-white/5 border border-white/10 rounded uppercase text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                            {height}%
                                         </div>
                                         <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: idx * 0.05, duration: 1, ease: [0.19, 1, 0.22, 1] }}
                                            className="w-full max-w-[12px] min-h-[4px] rounded-full bg-gradient-to-t from-blue-600/20 via-blue-500/80 to-indigo-400 group-hover/bar:from-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                                         />
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/[0.05] group-hover/bar:bg-blue-500 transition-colors duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Secondary Tactical Intel */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] backdrop-blur-3xl" />
                    <div className="relative p-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Protocol Logs</h3>
                                <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mt-1">Live Identity Verification</p>
                            </div>
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse border-4 border-blue-500/20" />
                        </div>

                        <div className="space-y-4 flex-1">
                            {stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((activity, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.03] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-300 group/item flex items-center gap-5"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[11px] font-black text-slate-500 group-hover/item:text-white group-hover/item:border-blue-500/30 transition-all shrink-0">
                                            {activity.user_name?.[0]?.toUpperCase() || 'W'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-black text-slate-200 uppercase tracking-widest truncate">{activity.user_name || 'Anonymous'}</p>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mt-1">
                                                <span className="text-emerald-500/50 mr-2">●</span>
                                                HANDSHAKE VERIFIED - {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            <Clock className="w-4 h-4 text-amber-500/50" />
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-16 rounded-2xl bg-white/[0.01] border border-white/[0.02] animate-pulse" />
                                ))
                            )}
                        </div>
                        
                        <button 
                            onClick={() => navigate('/admin/registrations')}
                            className="mt-8 py-4 w-full bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-white hover:bg-white/[0.05] hover:border-blue-500/30 transition-all group flex items-center justify-center gap-3"
                        >
                            View Comprehensive Feed
                            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Tactical Links */}
            <div className="relative group p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-[3rem]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                    {[
                        { to: '/admin/events', label: 'Manage Events', sub: 'Create and edit events', icon: Calendar, color: 'blue' },
                        { to: '/admin/registrations', label: 'View Registrations', sub: 'Check participant data', icon: Users, color: 'violet' },
                        { to: '/admin/scanner', label: 'QR Scanner', sub: 'Verify attendees', icon: Activity, color: 'emerald' }
                    ].map((btn, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(btn.to)}
                            className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-black/40 border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.02] transition-all group"
                        >
                            <div className={`p-4 bg-white/[0.03] rounded-2xl group-hover:scale-110 transition-all duration-500`}>
                                <btn.icon className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <div className="text-left">
                                <p className="font-black text-slate-200 uppercase tracking-widest mb-1">{btn.label}</p>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{btn.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
