import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    Calendar, 
    ShieldCheck, 
    Activity, 
    Mail, 
    Terminal,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    Cpu
} from 'lucide-react';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
        primary: 'text-primary bg-primary shadow-primary/30',
        emerald: 'text-emerald-500 bg-emerald-500 shadow-emerald-500/30',
        rose: 'text-rose-500 bg-rose-500 shadow-rose-500/30',
        amber: 'text-amber-500 bg-amber-500 shadow-amber-500/30',
        indigo: 'text-indigo-500 bg-indigo-500 shadow-indigo-500/30'
    };

    const currentColors = colorClasses[color] || colorClasses.primary;

    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className="bg-surface border border-border p-6 rounded-xl relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${currentColors.split(' ')[0]}`}>
                <Icon size={48} />
            </div>
            <div className="flex flex-col gap-1 relative z-10">
                <span className="text-xs font-medium text-gray-400">{title}</span>
                <div className="flex items-end gap-3 mt-1">
                    <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
                    {trend && (
                        <div className={`flex items-center gap-1 text-[10px] font-bold mb-1.5 ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {trendValue}
                        </div>
                    )}
                </div>
                <div className={`h-1 w-12 rounded-full mt-4 opacity-50 shadow-[0_0_10px_currentColor] ${currentColors.split(' ')[1]}`}></div>
            </div>
        </motion.div>
    );
};

const AdminDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        activeEvents: 0,
        recentActivity: [],
        attendanceRate: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchStats();
    }, [token]);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const [regRes, eventRes] = await Promise.all([
                axios.get(`${API_URL}/admin-registrations/`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/operations/events/`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const regs = regRes.data;
            const attended = Array.isArray(regs) ? regs.filter(r => r.is_used || r.status === 'ATTENDED').length : 0;

            setStats({
                totalRegistrations: Array.isArray(regs) ? regs.length : 0,
                activeEvents: Array.isArray(eventRes.data) ? eventRes.data.filter(e => e.is_registration_open).length : 0,
                recentActivity: Array.isArray(regs) ? regs.slice(0, 5) : [],
                attendanceRate: Array.isArray(regs) && regs.length > 0 ? Math.round((attended / regs.length) * 100) : 0
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setError('Failed to establish connection with core servers.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                         <Activity className="text-primary w-6 h-6" />
                         Dashboard
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Real-time analytics and system overview</p>
                </div>
                <button 
                    onClick={fetchStats}
                    className="p-2 rounded-lg bg-white/5 border border-border text-gray-400 hover:text-white transition-colors"
                >
                    <Activity className={`w-5 h-5 ${loading ? 'animate-spin text-primary' : ''}`} />
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3 text-rose-400">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                    <button onClick={fetchStats} className="text-sm text-rose-400 hover:text-rose-300 transition-colors">Retry</button>
                </div>
            )}

            {/* KPI Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${loading && stats.totalRegistrations === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                <KPICard 
                    title="Total Registrations" 
                    value={loading && stats.totalRegistrations === 0 ? '---' : stats.totalRegistrations} 
                    icon={Users} 
                    trend="up" 
                    trendValue="+12%" 
                    color="primary"
                />
                <KPICard 
                    title="Active Events" 
                    value={loading && stats.activeEvents === 0 ? '---' : stats.activeEvents} 
                    icon={Calendar} 
                    trend="up" 
                    trendValue="+2" 
                    color="emerald"
                />
                <KPICard 
                    title="Attendance Rate" 
                    value={loading && stats.attendanceRate === 0 ? '---' : `${stats.attendanceRate}%`} 
                    icon={ShieldCheck} 
                    trend="up" 
                    trendValue="+5%" 
                    color="indigo"
                />
                <KPICard 
                    title="System Status" 
                    value={error ? "Error" : (loading ? "Loading" : "Healthy")} 
                    icon={Activity} 
                    trend="up" 
                    trendValue="Normal" 
                    color={error ? "rose" : "emerald"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-xs font-mono font-black text-gray-500 uppercase tracking-widest">
                                <Terminal className="w-4 h-4 text-primary" />
                                RECENT_INTELLIGENCE_FEED
                            </h3>
                            <button className="text-[10px] font-mono text-primary hover:underline">VIEW_ALL</button>
                        </div>
                        <div className="p-0">
                            {stats.recentActivity.map((activity, i) => (
                                <div key={i} className="px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                                            <Zap size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                New registration for <span className="text-primary">{activity.event_details.title}</span>
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-mono mt-0.5">AGENT: {activity.user_email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Launch Panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 group hover:border-primary/40 transition-all cursor-pointer">
                            <ShieldCheck className="text-primary mb-4 w-8 h-8 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-1">Launch Scanner</h4>
                            <p className="text-xs text-gray-500">Fast QR verification for physical attendance.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 group hover:border-indigo-500/40 transition-all cursor-pointer">
                            <Mail className="text-indigo-500 mb-4 w-8 h-8 group-hover:scale-110 transition-transform" />
                            <h4 className="font-bold text-white mb-1">Dispatch Alerts</h4>
                            <p className="text-xs text-gray-500">Send encrypted notifications to all agents.</p>
                        </div>
                    </div>
                </div>

                {/* System Status Sidebar */}
                <div className="space-y-6">
                    <div className="bg-[#0A0A0B] border border-white/5 p-6 rounded-2xl">
                        <h3 className="text-xs font-mono font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-primary" />
                             SECURITY_AUDIT
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'DATABASE_SYNC', status: 'SYNCHRONIZED', colorClass: 'text-emerald-500 bg-emerald-500' },
                                { label: 'FIREWALL_STATUS', status: 'ACTIVE', colorClass: 'text-emerald-500 bg-emerald-500' },
                                { label: 'ENCRYPTION_ENGINE', status: 'OPERATIONAL', colorClass: 'text-emerald-500 bg-emerald-500' },
                                { label: 'THREAT_DETECTION', status: 'IDLE', colorClass: 'text-gray-500 bg-gray-500' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <span className="text-[9px] font-mono text-gray-500 tracking-widest">{item.label}</span>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-[10px] font-bold ${item.colorClass.split(' ')[0]}`}>{item.status}</span>
                                        <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${item.colorClass.split(' ')[1]}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0A0A0B] border border-white/5">
                         <h3 className="text-xs font-mono font-black text-gray-500 uppercase tracking-widest mb-4">MEMBER_GROWTH</h3>
                         <div className="h-32 flex items-end gap-1.5 justify-between">
                            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 75, 60, 100].map((h, i) => (
                                <div 
                                    key={i} 
                                    className="flex-1 bg-primary/20 rounded-sm hover:bg-primary transition-colors cursor-pointer"
                                    style={{ height: `${h}%` }}
                                ></div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
