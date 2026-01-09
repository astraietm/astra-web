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

const KPICard = ({ title, value, icon: Icon, trend, trendValue }) => {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-vision-card backdrop-blur-2xl border border-white/5 p-5 rounded-[20px] flex justify-between items-center relative overflow-hidden"
        >
            <div className="flex flex-col gap-1 z-10">
                <span className="text-xs font-medium text-gray-400 font-inter">{title}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-white font-inter">{value}</span>
                    {trend && (
                        <span className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {trendValue}
                        </span>
                    )}
                </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-vision-primary flex items-center justify-center shadow-lg shadow-blue-500/30 z-10">
                <Icon size={22} className="text-white" />
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
        <div className="space-y-6 pb-6">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    title="Total Registrations" 
                    value={loading ? '...' : stats.totalRegistrations} 
                    icon={Users} 
                    trend="up" 
                    trendValue="+12%" 
                />
                <KPICard 
                    title="Active Events" 
                    value={loading ? '...' : stats.activeEvents} 
                    icon={Calendar} 
                    trend="up" 
                    trendValue="+2" 
                />
                <KPICard 
                    title="Attendance Rate" 
                    value={loading ? '...' : `${stats.attendanceRate}%`} 
                    icon={ShieldCheck} 
                    trend="down" 
                    trendValue="-2%" 
                />
                <KPICard 
                    title="System Status" 
                    value={error ? "Error" : (loading ? "..." : "Healthy")} 
                    icon={Activity} 
                    trend="up" 
                    trendValue="Good" 
                />
            </div>

            {/* Row 2: Welcome & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-80">
                {/* Welcome Card */}
                <div className="lg:col-span-1 bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute inset-0 bg-gradient-to-br from-vision-primary/20 to-purple-600/20 z-0"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-vision-primary/30 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                    
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-medium mb-1">Welcome back,</p>
                        <h2 className="text-2xl font-bold text-white mb-2">Admin User</h2>
                        <p className="text-gray-400 text-sm mb-8 max-w-[200px]">
                            Glad to see you again! <br/>
                            Ask me anything.
                        </p>
                        <button className="flex items-center gap-2 text-white text-sm font-bold hover:gap-3 transition-all">
                            Tap to record <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Satisfaction Rate */}
                <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 flex flex-col items-center justify-center relative">
                    <h3 className="text-white font-bold text-lg absolute top-6 left-6">Satisfaction Rate</h3>
                    <p className="text-gray-400 text-sm absolute top-12 left-6">From all projects</p>
                    
                    <div className="relative w-40 h-40 mt-8 flex items-center justify-center">
                        {/* CSS Circular Progress Mockup */}
                        <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="#1F2749" strokeWidth="8" fill="none" />
                            <circle cx="50" cy="50" r="40" stroke="#0075FF" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="25" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="w-10 h-10 bg-vision-primary rounded-full flex items-center justify-center text-white mb-1 shadow-lg shadow-blue-500/50">
                                <span className="text-lg">☺</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-vision-surface rounded-xl px-8 py-3 mt-4 flex items-center gap-8 shadow-inner">
                        <div className="text-center">
                            <p className="text-gray-400 text-xs mb-1">0%</p>
                        </div>
                        <div className="text-center">
                            <h4 className="text-white font-bold text-xl">95%</h4>
                            <p className="text-gray-400 text-xs">Based on likes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs mb-1">100%</p>
                        </div>
                    </div>
                </div>

                {/* Referral Tracking */}
                <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 flex flex-col justify-between relative">
                    <div className="flex justify-between items-start">
                        <h3 className="text-white font-bold text-lg">Referral Tracking</h3>
                        <div className="w-8 h-8 bg-[#2A304F] rounded-lg flex items-center justify-center text-vision-primary">
                            <span className="font-bold">...</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                        <div className="bg-[#171C36] rounded-xl p-4 flex-1">
                            <p className="text-gray-400 text-xs mb-1">Invited</p>
                            <h4 className="text-white font-bold text-lg">145 people</h4>
                        </div>
                        <div className="bg-[#171C36] rounded-xl p-4 flex-1">
                            <p className="text-gray-400 text-xs mb-1">Bonus</p>
                            <h4 className="text-white font-bold text-lg">1,465</h4>
                        </div>
                    </div>

                    <div className="mt-6 relative flex-1 flex items-center justify-center">
                         <svg className="w-32 h-32 rotate-[-90deg]" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="#1F2749" strokeWidth="10" fill="none" />
                            <circle cx="50" cy="50" r="40" stroke="#05CD99" strokeWidth="10" fill="none" strokeDasharray="251" strokeDashoffset="50" strokeLinecap="round" />
                        </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-gray-400 text-xs">Safety</span>
                            <span className="text-white font-bold text-xl">9.3</span>
                            <span className="text-gray-400 text-xs">Total Score</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Sales/Registrations Overview */}
                <div className="lg:col-span-3 bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6">
                    <p className="text-white font-bold text-lg mb-1">Registration Overview</p>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-emerald-400 font-bold text-sm">(+5) more</span>
                        <span className="text-gray-400 text-sm">in 2024</span>
                    </div>

                    <div className="h-64 mt-4 relative">
                        {/* Simplified Wave Chart */}
                        <div className="absolute inset-0 flex items-end justify-between px-2 gap-2">
                             {[30, 45, 35, 60, 50, 75, 55, 65, 80, 70, 90, 85].map((h, i) => (
                                 <div key={i} className="w-full bg-gradient-to-t from-vision-primary/10 to-transparent rounded-t-lg relative group">
                                     <div 
                                        className="absolute bottom-0 left-0 right-0 bg-vision-primary/50 group-hover:bg-vision-primary transition-colors rounded-t-sm"
                                        style={{ height: `${h}%` }}
                                     ></div>
                                 </div>
                             ))}
                        </div>
                        {/* Mock Curve Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
                            <path 
                                d="M0,200 C50,150 100,220 150,100 C200,50 250,150 300,80 C350,20 400,100 450,50 L450,300 L0,300 Z" 
                                fill="url(#gradient)" 
                                opacity="0.2"
                            />
                            <path 
                                d="M0,200 C50,150 100,220 150,100 C200,50 250,150 300,80 C350,20 400,100 450,50" 
                                stroke="#0075FF" 
                                strokeWidth="3" 
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                            />
                             <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#0075FF" stopOpacity="0.5"/>
                                    <stop offset="100%" stopColor="#0075FF" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Active Users/Events */}
                <div className="lg:col-span-2 bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6">
                    <div className="h-48 mb-6 relative flex items-end gap-3">
                         {/* Bar Chart */}
                        {[40, 70, 60, 90, 50, 30, 80, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-white flex flex-col justify-end rounded-md overflow-hidden bg-opacity-[0.1]">
                                <div 
                                    className="bg-white rounded-md w-1.5 mx-auto"
                                    style={{ height: `${h}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-1">Active Users</h3>
                    <p className="text-gray-400 text-sm mb-6"><span className="text-emerald-400 font-bold">(+23)</span> than last week</p>

                    <div className="grid grid-cols-4 gap-4">
                        {[
                            { label: 'Users', icon: Users, val: '32,984' },
                            { label: 'Clicks', icon: Zap, val: '2.42m' },
                            { label: 'Sales', icon: ArrowUpRight, val: '2,400$' },
                            { label: 'Items', icon: Cpu, val: '320' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-1 mb-1 text-gray-400 text-[10px] font-bold uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-vision-primary"></div>
                                    {item.label}
                                </div>
                                <p className="text-white font-bold text-sm">{item.val}</p>
                                <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                                     <div className="h-full bg-vision-primary w-[60%] rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 4: Projects (Recent Registrations) */}
            <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-white font-bold text-lg">Recent Registrations</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <p className="text-gray-400 text-sm"><span className="font-bold text-gray-300">30 done</span> this month</p>
                        </div>
                    </div>
                    <button className="p-2 text-vision-primary hover:bg-white/5 rounded-lg transition-colors">
                        <Terminal size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="text-[10px] text-gray-400 uppercase font-bold py-3 border-b border-gray-800">Companies</th>
                                <th className="text-[10px] text-gray-400 uppercase font-bold py-3 border-b border-gray-800">Members</th>
                                <th className="text-[10px] text-gray-400 uppercase font-bold py-3 border-b border-gray-800 text-center">Budget</th>
                                <th className="text-[10px] text-gray-400 uppercase font-bold py-3 border-b border-gray-800">Completion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentActivity.concat([1,2,3]).slice(0, 5).map((activity, i) => (
                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 border-b border-gray-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-vision-primary/20 flex items-center justify-center text-vision-primary font-bold text-xs">
                                                {activity.event_details?.title?.substring(0,2) || "AS"}
                                            </div>
                                            <span className="text-white font-bold text-sm">{activity.event_details?.title || "Astra Event System"}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-gray-800/50">
                                        <div className="flex -space-x-2">
                                            {[1,2,3,4].map(j => (
                                                <div key={j} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-[#0F1535] text-[8px] flex items-center justify-center text-white">
                                                    {j}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 border-b border-gray-800/50 text-center">
                                        <span className="text-white font-bold text-sm">$14,000</span>
                                    </td>
                                    <td className="py-4 border-b border-gray-800/50 max-w-[140px]">
                                        <div className="flex items-center gap-3">
                                            <span className="text-vision-primary font-bold text-xs">60%</span>
                                            <div className="h-1 bg-gray-800 rounded-full flex-1">
                                                <div className="h-full bg-vision-primary w-[60%] rounded-full shadow-[0_0_10px_#0075FF]"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
