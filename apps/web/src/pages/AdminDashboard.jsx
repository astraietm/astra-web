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
    Loader2,
    Shield,
    RotateCcw,
    Zap,
    ChevronRight,
    Cpu,
    Target,
    Database,
    Globe,
    Terminal,
    Lock
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
                    recentActivity: regs.slice(0, 8)
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
            title: 'REGISTRY_STATUS',
            value: stats.totalRegistrations,
            label: 'Identified_Nodes',
            trend: '+12.5%',
            icon: Users,
            color: 'blue'
        },
        {
            title: 'OPERATIONAL_EVENTS',
            value: stats.activeEvents,
            label: 'Active_Sectors',
            trend: '+3',
            icon: Calendar,
            color: 'violet'
        },
        {
            title: 'AUTH_RATING',
            value: `${stats.attendanceRate}%`,
            label: 'Verification_Rate',
            trend: '+5.2%',
            icon: Activity,
            color: 'emerald'
        },
        {
            title: 'CORE_LATENCY',
            value: '2ms',
            label: 'Sync_Performance',
            trend: 'Stable',
            icon: Zap,
            color: 'amber'
        }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-2 border-blue-500/10 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" strokeWidth={3} />
                    </div>
                    <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-[spin_1s_linear_infinite]" />
                    <div className="absolute inset-0 w-20 h-20 text-blue-500 blur-2xl animate-pulse opacity-30" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Synchronizing_Matrix</span>
                    <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest animate-pulse">Establishing Secure Uplink to Primary Core...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Context Header */}
            <div className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">Command_Center</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Dashboard_Overview_Interface</h1>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono uppercase tracking-tight">
                            Identity_Confirmed: <span className="text-blue-500">{user?.first_name || 'ADMIN_OPERATOR'}</span> // Uplink_Stable: <span className="text-emerald-500">CONNECTED</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 w-full xl:w-auto">
                   <button className="flex-1 xl:flex-none h-14 px-8 bg-white/[0.01] border border-white/[0.05] rounded-[1.25rem] text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white hover:bg-white/[0.03] transition-all">
                      EXTRACT_REPORT
                   </button>
                   <button onClick={() => navigate('/admin/scanner')} className="flex-1 xl:flex-none h-14 px-10 bg-blue-600 rounded-[1.25rem] text-[9px] font-black text-white uppercase tracking-[0.3em] hover:bg-blue-500 shadow-[0_12px_30px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5">
                      DEPLOY_SCANNER
                   </button>
                </div>
            </div>

            {/* Matrix Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                        className="group relative p-8 bg-white/[0.01] border border-white/[0.03] rounded-[2rem] overflow-hidden hover:bg-white/[0.02] hover:border-white/10 transition-all duration-700"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-1000 pointer-events-none grayscale">
                            <stat.icon size={120} />
                        </div>
                        
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex items-center justify-between mb-10">
                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] group-hover:text-slate-400 transition-colors">{stat.title}</span>
                                <div className={`px-2 py-1 rounded-lg text-[8px] font-black ${stat.trend.includes('+') ? 'text-emerald-500 bg-emerald-500/5 border border-emerald-500/10' : 'text-slate-500 bg-white/5 border border-white/5'} flex items-center gap-1.5`}>
                                    <TrendingUp size={10} strokeWidth={3} />
                                    {stat.trend}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none group-hover:text-blue-500 transition-colors duration-500">
                                    {stat.value}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-slate-800 group-hover:bg-blue-500 transition-colors" />
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tactical Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Visual Analytics */}
                <div className="xl:col-span-2 p-10 bg-white/[0.01] border border-white/[0.03] rounded-[3rem] flex flex-col relative overflow-hidden group min-h-[500px]">
                    <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-blue-600/[0.03] to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative z-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]" />
                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">
                                    REGISTRY_THROUGHPUT_MAP
                                </h3>
                            </div>
                            <p className="text-[9px] text-slate-700 font-black font-mono uppercase tracking-[0.2em] ml-4">Temporal_Node_Analysis_Core</p>
                        </div>
                        <div className="flex bg-white/[0.02] border border-white/[0.05] rounded-[1.25rem] p-1.5 shrink-0 relative overflow-hidden group/toggle">
                           {['24H', '7D', '30D'].map((t) => (
                               <button 
                                key={t} 
                                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all relative z-10 ${t === '24H' ? 'bg-blue-600 text-white shadow-[0_5px_15px_rgba(37,99,235,0.3)]' : 'text-slate-700 hover:text-slate-400'}`}
                               >
                                   {t}
                               </button>
                           ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-h-[300px] flex items-end justify-between gap-4 relative z-10 px-4 pb-4">
                        <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-[8px] font-black text-slate-800 uppercase tracking-widest pointer-events-none pb-4">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                        </div>

                        {[55, 75, 45, 95, 65, 85, 60, 95, 80, 50, 70, 85, 40, 60, 80, 90, 75, 55, 65, 85].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full">
                                <div className="absolute left-0 right-0 h-px bg-white/[0.02] pointer-events-none" style={{ bottom: '25%' }} />
                                <div className="absolute left-0 right-0 h-px bg-white/[0.02] pointer-events-none" style={{ bottom: '50%' }} />
                                <div className="absolute left-0 right-0 h-px bg-white/[0.02] pointer-events-none" style={{ bottom: '75%' }} />
                                
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 0.8 + (i * 0.04), duration: 2, ease: [0.23, 1, 0.32, 1] }}
                                    className="w-full relative min-w-[8px] rounded-t-lg"
                                >
                                    <div className="absolute inset-0 bg-blue-600/10 rounded-t-lg group-hover/bar:bg-blue-600/30 transition-all duration-300" />
                                    <div className="absolute bottom-0 w-full h-1.5 bg-blue-500 rounded-sm shadow-[0_0_20px_rgba(37,99,235,0.8)]" />
                                    
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 bg-black border border-white/10 rounded-xl px-3 py-2 z-20 pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                        <span className="text-[10px] font-black text-white tabular-nums">{h}%</span>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Real-time Uplink */}
                <div className="p-10 bg-white/[0.01] border border-white/[0.03] rounded-[3rem] flex flex-col relative overflow-hidden h-full group/feed">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none opacity-0 group-hover/feed:opacity-100 transition-opacity duration-1000" />
                    
                    <div className="flex items-center justify-between mb-12 relative z-10">
                         <div className="space-y-1">
                            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] group-hover/feed:text-blue-500 transition-colors">ACTIVITY_STREAM</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-[8px] text-slate-700 font-black font-mono uppercase tracking-[0.4em]">LIVE_CORE_SYNC</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/admin/registrations')} className="w-12 h-12 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-slate-800 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center">
                            <ArrowUpRight size={18} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar relative z-10">
                        {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 + (idx * 0.05), duration: 0.8 }}
                                    className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-white/[0.01] border border-white/[0.02] hover:bg-white/[0.02] hover:border-white/[0.1] transition-all duration-500 group/item relative overflow-hidden"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-[12px] font-black text-blue-500 group-hover/item:scale-110 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-500 shrink-0">
                                        {activity.user_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-black text-white truncate uppercase tracking-tight group-hover/item:text-blue-500 transition-colors leading-none mb-1">{activity.user_name || 'UNSPECIFIED_NODE'}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-800" />
                                            <p className="text-[9px] font-black text-slate-700 truncate uppercase tracking-widest">{activity.event_details?.title || 'REGISTRY_LOG'}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[9px] font-mono text-slate-800 font-black tracking-tighter">
                                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-800 gap-8">
                                <RotateCcw size={40} strokeWidth={1} className="opacity-20 animate-[spin_5s_linear_infinite]" />
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">NULL_ACTIVITY</p>
                                    <p className="text-[8px] font-mono uppercase tracking-widest">Awaiting sector engagement</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hub Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'EVENT_SYNT_DATABASE', desc: 'Initialize and maintain sector operations', icon: Database, to: '/admin/events', color: 'blue' },
                    { title: 'SECURITY_REG_ARCHIVE', desc: 'Audit participant identity clusters', icon: Shield, to: '/admin/registrations', color: 'indigo' },
                    { title: 'SYST_OPER_MANIFEST', desc: 'Review operational audit logs', icon: Terminal, to: '/admin/logs', color: 'cyan' }
                ].map((action, i) => (
                    <button 
                        key={i}
                        onClick={() => navigate(action.to)}
                        className="group relative p-10 bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-700 overflow-hidden text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] group-hover:border-blue-500/30 group-hover:bg-blue-500/5 group-hover:text-blue-500 flex items-center justify-center text-slate-500 transition-all duration-700 shrink-0">
                                <action.icon size={26} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="flex-1 overflow-hidden space-y-2">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] group-hover:text-blue-500 transition-colors">{action.title}</h4>
                                <p className="text-[10px] text-slate-700 uppercase tracking-tight truncate group-hover:text-slate-500 transition-colors">{action.desc}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 -translate-x-6 group-hover:translate-x-0 transition-all duration-700">
                                <ChevronRight size={16} className="text-blue-500" />
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
