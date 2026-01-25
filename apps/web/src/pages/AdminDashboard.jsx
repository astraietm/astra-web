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
    AlertCircle
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
            color: 'blue',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500/20'
        },
        {
            title: 'Active Events',
            value: stats.activeEvents,
            change: '+3',
            trend: 'up',
            icon: Calendar,
            color: 'violet',
            bgColor: 'bg-violet-500/10',
            iconColor: 'text-violet-400',
            borderColor: 'border-violet-500/20'
        },
        {
            title: 'Attendance Rate',
            value: `${stats.attendanceRate}%`,
            change: '+5.2%',
            trend: 'up',
            icon: Activity,
            color: 'emerald',
            bgColor: 'bg-emerald-500/10',
            iconColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/20'
        },
        {
            title: 'Conversion Rate',
            value: '68%',
            change: '-2.1%',
            trend: 'down',
            icon: BarChart3,
            color: 'amber',
            bgColor: 'bg-amber-500/10',
            iconColor: 'text-amber-400',
            borderColor: 'border-amber-500/20'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-100">Dashboard</h1>
                    <p className="text-sm text-slate-400 mt-1">Welcome back, {user?.name || 'Admin'}</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Generate Report
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} strokeWidth={2} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${
                                stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                                {stat.trend === 'up' ? (
                                    <TrendingUp className="w-3 h-3" />
                                ) : (
                                    <TrendingDown className="w-3 h-3" />
                                )}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                            <p className="text-3xl font-semibold text-slate-100">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-100">Registration Trends</h3>
                            <p className="text-sm text-slate-400 mt-1">Last 7 days</p>
                        </div>
                        <button className="text-sm text-slate-400 hover:text-slate-100 font-medium">
                            View All
                        </button>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-3">
                        {[40, 65, 45, 80, 55, 90, 70].map((height, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                    className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg hover:from-blue-500 hover:to-blue-400 transition-all cursor-pointer"
                                />
                                <span className="text-xs text-slate-400 font-medium">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-100">Recent Activity</h3>
                            <p className="text-sm text-slate-400 mt-1">Latest registrations</p>
                        </div>
                        <button 
                            onClick={() => navigate('/admin/registrations')}
                            className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                        >
                            View All
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {stats.recentActivity.length > 0 ? (
                            stats.recentActivity.map((activity, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-sm shrink-0 border border-blue-500/20">
                                        {activity.user_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-100 truncate">
                                            {activity.user_name || 'Anonymous'}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {activity.event_details?.title || 'Event'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {activity.is_used || activity.status === 'ATTENDED' ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-amber-600" />
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/admin/events')}
                        className="flex items-center gap-4 p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                    >
                        <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                            <Calendar className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-slate-100">Manage Events</p>
                            <p className="text-sm text-slate-400">Create and edit events</p>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/admin/registrations')}
                        className="flex items-center gap-4 p-4 rounded-lg border border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all group"
                    >
                        <div className="p-3 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
                            <Users className="w-5 h-5 text-violet-400" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-slate-900">View Registrations</p>
                            <p className="text-sm text-slate-500">Check participant data</p>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate('/admin/scanner')}
                        className="flex items-center gap-4 p-4 rounded-lg border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group"
                    >
                        <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                            <Activity className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-slate-900">QR Scanner</p>
                            <p className="text-sm text-slate-500">Verify attendees</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
