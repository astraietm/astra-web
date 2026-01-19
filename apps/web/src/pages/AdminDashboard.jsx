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

    // Professional Dark Stat Card
    const StatCard = ({ label, value, trend, icon: Icon, trendColor = 'text-emerald-400', iconColor = 'text-indigo-400', iconBg = 'bg-indigo-500/10' }) => (
        <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor} border border-white/5`}>
                    <Icon size={20} strokeWidth={2} />
                </div>
                {trend && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendColor.replace('text-', 'bg-')}/10 ${trendColor} flex items-center gap-1 border border-white/5`}>
                        <TrendingUp size={12} /> {trend}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{label}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-full space-y-8 animate-fade-in pb-10">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-800 pb-6">
                <div>
                   <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
                   <p className="text-slate-400 font-medium mt-1">Welcome back, {user?.name || 'Administrator'}</p>
                </div>
                <div className="flex gap-3">
                    <button className="h-10 px-4 rounded-lg bg-[#0f172a] border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors shadow-sm">
                        Download Report
                    </button>
                    <button className="h-10 px-4 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/20 flex items-center gap-2">
                        <Zap size={16} fill="currentColor" /> Quick Action
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Registrations" 
                    value={loading ? "..." : stats.totalRegistrations} 
                    trend="+12%"
                    icon={Users}
                />
                <StatCard 
                    label="Active Events" 
                    value={loading ? "..." : stats.activeEvents} 
                    trend="Now Live"
                    trendColor="text-blue-400"
                    iconColor="text-blue-400"
                    iconBg="bg-blue-500/10"
                    icon={Calendar}
                />
                <StatCard 
                    label="Check-in Rate" 
                    value={loading ? "..." : `${stats.attendanceRate}%`} 
                    trend="+5%"
                    iconColor="text-emerald-400"
                    iconBg="bg-emerald-500/10"
                    icon={Target}
                />
                 <StatCard 
                    label="System Status" 
                    value="Normal" 
                    trend="99.9% Uptime"
                    trendColor="text-emerald-400"
                    iconColor="text-amber-400"
                    iconBg="bg-amber-500/10"
                    icon={Activity}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart / Area */}
                <div className="lg:col-span-2 bg-[#0f172a] rounded-xl border border-slate-800 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="text-base font-bold text-white">Traffic Analysis</h3>
                         <div className="flex gap-2">
                             <span className="px-3 py-1 rounded-md bg-slate-800 text-xs font-medium text-slate-300">Daily</span>
                             <span className="px-3 py-1 rounded-md bg-transparent border border-slate-700 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">Weekly</span>
                         </div>
                    </div>
                    
                    {/* Placeholder for Chart */}
                    <div className="h-64 flex items-end justify-between gap-4 px-2">
                        {Array.from({ length: 12 }).map((_, i) => (
                             <div key={i} className="w-full bg-slate-800/50 rounded-t-sm relative group">
                                 <div 
                                    className="absolute bottom-0 left-0 w-full bg-indigo-600 rounded-t-sm transition-all duration-500 hover:bg-indigo-500"
                                    style={{ height: `${Math.random() * 60 + 20}%` }}
                                 />
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity border border-slate-600">
                                     {Math.floor(Math.random() * 1000)}
                                 </div>
                             </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 border-t border-slate-800 pt-4 text-xs text-slate-500 font-medium">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                    </div>
                </div>

                {/* Right Side List */}
                <div className="bg-[#0f172a] rounded-xl border border-slate-800 shadow-sm flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-base font-bold text-white">Recent Activity</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loading ? (
                            <div className="text-center py-4 text-slate-600">Loading...</div>
                        ) : stats.logs.slice(0, 6).map((log, i) => (
                            <div key={i} className="flex gap-3 items-start group p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${log.id % 2 === 0 ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                <div>
                                    <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{log.user_name}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Action ID: #{log.id} • <span className="text-slate-600">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                         <button className="w-full mt-2 py-2 text-xs font-medium text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                            View Full History
                        </button>
                    </div>
                </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Create Event', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { title: 'Manage Users', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                    { title: 'System Settings', icon: Cpu, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                ].map((action, i) => (
                    <button key={i} className={`flex items-center gap-4 p-4 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-600 shadow-sm hover:shadow-md transition-all text-left group`}>
                         <div className={`p-3 rounded-lg ${action.bg} ${action.color} border ${action.border}`}>
                             <action.icon size={20} />
                         </div>
                         <div>
                             <h4 className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">{action.title}</h4>
                             <p className="text-xs text-slate-500 align-start">Quick Access</p>
                         </div>
                         <ArrowUpRight className="ml-auto text-slate-600 group-hover:text-slate-400" size={16} />
                    </button>
                ))}
             </div>

        </div>
    );
};

export default AdminDashboard;
