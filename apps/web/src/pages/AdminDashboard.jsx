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
    RotateCcw
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
            title: 'Total Registrations',
            value: stats.totalRegistrations,
            change: '+12.5%',
            trend: 'up',
            icon: Users,
            color: 'blue'
        },
        {
            title: 'Active Events',
            value: stats.activeEvents,
            change: '+3',
            trend: 'up',
            icon: Calendar,
            color: 'violet'
        },
        {
            title: 'Attendance Rate',
            value: `${stats.attendanceRate}%`,
            change: '+5.2%',
            trend: 'up',
            icon: Activity,
            color: 'emerald'
        },
        {
            title: 'System Status',
            value: 'Online',
            change: 'Stable',
            trend: 'none',
            icon: Shield,
            color: 'amber'
        }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <span className="text-sm font-medium text-slate-500">Loading Dashboard...</span>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Dashboard</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider relative z-10">Overview</h1>
                        <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
                            Welcome back, <span className="text-white font-medium">{user?.first_name || 'Admin'}</span>. Here is what is happening today.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl hover:border-white/[0.15] transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/[0.03] rounded-xl text-white">
                                <stat.icon size={20} />
                            </div>
                            {stat.trend !== 'none' && (
                                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {stat.change}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 p-8 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white">Analytics</h3>
                            <p className="text-sm text-slate-500">Registration trends over time</p>
                        </div>
                        <div className="flex gap-2">
                           <button className="px-4 py-2 bg-white/[0.05] rounded-lg text-xs font-medium text-white hover:bg-white/[0.1] transition-all">Daily</button>
                           <button className="px-4 py-2 bg-transparent text-xs font-medium text-slate-500 hover:text-white transition-all">Weekly</button>
                        </div>
                    </div>
                    
                    <div className="flex-1 flex items-end justify-between gap-4">
                        {[40, 70, 45, 90, 60, 85, 55, 95, 75, 50, 65, 80].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.05, duration: 1 }}
                                    className="w-full bg-blue-600/20 rounded-t-lg group-hover:bg-blue-600/40 transition-colors relative"
                                >
                                    <div className="absolute bottom-0 w-full bg-blue-600 h-[4px]" />
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="p-8 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                         <div>
                            <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                            <p className="text-sm text-slate-500">Latest platform actions</p>
                        </div>
                        <button onClick={() => navigate('/admin/registrations')} className="p-2 hover:bg-white/[0.05] rounded-lg transition-all text-slate-400 hover:text-white">
                            <ArrowUpRight size={18} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/[0.05]">
                                    <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-xs font-bold text-slate-300">
                                        {activity.user_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{activity.user_name || 'Unknown User'}</p>
                                        <p className="text-xs text-slate-500 truncate">{activity.event_details?.title || 'Event Registration'}</p>
                                    </div>
                                    <span className="text-xs text-slate-600 whitespace-nowrap">
                                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                                <RotateCcw size={24} className="mb-2 opacity-50" />
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Manage Events', desc: 'Create and edit events', icon: Calendar, to: '/admin/events', color: 'bg-blue-500' },
                    { title: 'View Registrations', desc: 'Check participant data', icon: Users, to: '/admin/registrations', color: 'bg-violet-500' },
                    { title: 'System Logs', desc: 'View audit trails', icon: Shield, to: '/admin/logs', color: 'bg-emerald-500' }
                ].map((action, i) => (
                    <button 
                        key={i}
                        onClick={() => navigate(action.to)}
                        className="flex items-center gap-4 p-6 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl hover:border-white/[0.2] transition-all group text-left"
                    >
                        <div className={`p-3 rounded-xl bg-white/[0.05] text-white group-hover:scale-110 transition-transform`}>
                            <action.icon size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">{action.title}</h4>
                            <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">{action.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
