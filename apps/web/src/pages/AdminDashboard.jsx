import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
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


const useCountUp = (value) => {
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));
    
    useEffect(() => {
        const controls = animate(motionValue, typeof value === 'number' ? value : parseFloat(value) || 0, {
            duration: 1.5,
            ease: "easeOut",
        });
        return controls.stop;
    }, [value]);

    return rounded;
};

const KPICard = ({ title, value, icon: Icon, trend, trendValue, isPrimary = false }) => {
    // Determine number vs string for animation
    const isNumber = typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)));
    const numericValue = isNumber ? (typeof value === 'number' ? value : parseFloat(value)) : 0;
    
    // We only animate if it's a number. If it's "..." or "Healthy", just show it.
    const displayValue = isNumber ? useCountUp(numericValue) : value;

    return (
        <motion.div 
            whileHover={{ y: -4 }}
            className={`
                backdrop-blur-xl border p-5 rounded-[20px] flex justify-between items-center relative overflow-hidden group
                ${isPrimary 
                    ? 'bg-gradient-to-b from-[#1a1f2b] to-[#11151c] border-white/10 shadow-2xl' 
                    : 'bg-[#0A0D14]/80 border-white/5 shadow-lg'}
            `}
        >
             {/* Hover Glow Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                ${isPrimary 
                    ? 'bg-gradient-to-tr from-vision-primary/10 to-transparent' 
                    : 'bg-gradient-to-tr from-white/5 to-transparent'}
            `} />

            <div className="flex flex-col gap-1 z-10">
                <span className="text-xs font-medium text-gray-500 font-inter tracking-wide uppercase">{title}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white font-inter tracking-tight">
                        {isNumber ? <motion.span>{displayValue}</motion.span> : value}
                        {typeof value === 'string' && value.includes('%') && '%'}
                    </span>
                    {trend && (
                        <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                            {trend === 'up' ? <ArrowUpRight size={10} className="mr-0.5" /> : <ArrowDownRight size={10} className="mr-0.5" />}
                            {trendValue}
                        </div>
                    )}
                </div>
            </div>
            <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors
                ${isPrimary ? 'bg-vision-primary shadow-blue-500/20' : 'bg-white/5 border border-white/5 text-gray-400 group-hover:text-white group-hover:border-white/20'}
            `}>
                <Icon size={20} className={isPrimary ? 'text-white' : ''} />
            </div>
        </motion.div>
    );
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper to generate smooth SVG path (Catmull-Rom spline or simple Bezier)
const generateSmoothPath = (points, width, height) => {
    if (points.length < 2) return "";
    
    // Normalize points to fit width/height
    const maxVal = Math.max(...points, 1);
    const stepX = width / (points.length - 1);
    
    // Invert Y because SVG 0 is top
    const coordinates = points.map((p, i) => [
        i * stepX,
        height - (p / maxVal) * height * 0.8 // Utilize 80% height to leave headroom
    ]);

    let d = `M ${coordinates[0][0]},${coordinates[0][1]}`;

    for (let i = 0; i < coordinates.length - 1; i++) {
        const [x0, y0] = coordinates[Math.max(i - 1, 0)];
        const [x1, y1] = coordinates[i];
        const [x2, y2] = coordinates[i + 1];
        const [x3, y3] = coordinates[Math.min(i + 2, coordinates.length - 1)];

        const cp1x = x1 + (x2 - x0) / 6;
        const cp1y = y1 + (y2 - y0) / 6;

        const cp2x = x2 - (x3 - x1) / 6;
        const cp2y = y2 - (y3 - y1) / 6;

        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }

    return d;
};

const AdminDashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalRegistrations: 0,
        activeEvents: 0,
        recentActivity: [],
        upcomingEvents: [],
        trafficData: [], // [5, 12, 8, ...] counts for graph
        trafficLabels: [], // ['Jan', 'Feb'...]
        attendanceRate: 0,
        systemHealth: {
            dbLoad: 12,
            latency: 24,
            storage: 45
        }
    });

    // ... (fetchStats logic update)
    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const [regRes, eventRes] = await Promise.all([
                axios.get(`${API_URL}/admin-registrations/`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/operations/events/`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            const regs = regRes.data;
            const events = eventRes.data;
            const attended = Array.isArray(regs) ? regs.filter(r => r.is_used || r.status === 'ATTENDED').length : 0;

            // Process Traffic Data (Last 6 Months)
            const months = 6;
            const trafficCounts = new Array(months).fill(0);
            const trafficLabels = [];
            const now = new Date();
            
            // Initialize labels
            for(let i=0; i<months; i++) {
                const d = new Date();
                d.setMonth(now.getMonth() - (months - 1 - i));
                trafficLabels.push(d.toLocaleString('default', { month: 'short' }));
            }

            // Bucket registrations
            if (Array.isArray(regs)) {
                regs.forEach(r => {
                    const regDate = new Date(r.registration_date);
                    // simple diff in months from now
                    const monthDiff = (now.getFullYear() - regDate.getFullYear()) * 12 + (now.getMonth() - regDate.getMonth());
                    if (monthDiff < months && monthDiff >= 0) {
                        trafficCounts[months - 1 - monthDiff]++;
                    }
                });
            }

            // Sort events by date
            const sortedEvents = Array.isArray(events) 
                ? [...events].sort((a,b) => new Date(a.date) - new Date(b.date)).filter(e => new Date(e.date) >= new Date())
                : [];

            setStats(prev => ({
                ...prev,
                totalRegistrations: Array.isArray(regs) ? regs.length : 0,
                activeEvents: Array.isArray(events) ? events.filter(e => e.is_registration_open).length : 0,
                upcomingEvents: sortedEvents.slice(0, 4),
                recentActivity: Array.isArray(regs) ? regs.slice(0, 5) : [],
                trafficData: trafficCounts,
                trafficLabels: trafficLabels,
                attendanceRate: Array.isArray(regs) && regs.length > 0 ? Math.round((attended / regs.length) * 100) : 0
            }));
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            setError('Failed to establish connection with core servers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Calculate dynamic path
    // Width can be percentage based, but SVG paths need units. We assume a coordinate system of 1000x300 for the SVG viewbox.
    const pathData = generateSmoothPath(stats.trafficData.length > 0 ? stats.trafficData : [0,0,0,0,0,0], 1000, 300);
    // Determine fill path (close the loop)
    const fillPath = pathData ? `${pathData} L 1000,400 L 0,400 Z` : "";


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
                    isPrimary={true}
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

            {/* Row 2: Welcome & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-80">
                {/* Welcome Card */}
                <div className="lg:col-span-1 bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 relative overflow-hidden flex flex-col justify-between group">
                    <div className="absolute inset-0 bg-gradient-to-br from-vision-primary/20 to-purple-600/20 z-0"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-vision-primary/30 blur-[80px] rounded-full -mr-16 -mt-16"></div>
                    
                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-medium mb-1">Welcome back,</p>
                        <h2 className="text-2xl font-bold text-white mb-2">Admin User</h2>
                        <p className="text-gray-400 text-sm mb-8 max-w-[200px]">
                            System is fully operational. <br/>
                            Ready for command.
                        </p>
                        <button className="flex items-center gap-2 text-white text-sm font-bold hover:gap-3 transition-all">
                            View Reports <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 flex flex-col relative">
                    <h3 className="text-white font-bold text-lg mb-4">Quick Command</h3>
                    
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        <button 
                            onClick={() => navigate('/admin/events')}
                            className="flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all group"
                        >
                            <Calendar className="w-6 h-6 text-vision-primary group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-gray-300">New Event</span>
                        </button>
                        <button 
                            onClick={() => navigate('/admin/notifications')}
                            className="flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all group"
                        >
                            <Mail className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-gray-300">Send Blast</span>
                        </button>
                        <button 
                            onClick={() => navigate('/admin/logs')}
                            className="flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all group"
                        >
                            <ShieldCheck className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-gray-300">Audit Logs</span>
                        </button>
                        <button 
                            onClick={() => navigate('/admin/settings')}
                            className="flex flex-col items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-all group"
                        >
                            <Terminal className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-gray-300">System</span>
                        </button>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 flex flex-col relative">
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white font-bold text-lg">System Health</h3>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${stats.systemHealth.latency < 300 ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
                            <span className={`${stats.systemHealth.latency < 300 ? 'text-emerald-500' : 'text-amber-500'} text-xs font-bold`}>
                                {stats.systemHealth.latency < 300 ? 'LIVE' : 'DEGRADED'}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 justify-center">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Database Load</span>
                                <span className="text-white font-bold">{stats.systemHealth.dbLoad}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.systemHealth.dbLoad}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">API Latency</span>
                                <span className="text-white font-bold">{stats.systemHealth.latency}ms</span>
                            </div>
                            <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                <motion.div 
                                    className={`h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] ${
                                        stats.systemHealth.latency < 100 ? 'bg-vision-primary' : 
                                        stats.systemHealth.latency < 300 ? 'bg-amber-400' : 'bg-rose-500'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (stats.systemHealth.latency / 500) * 100)}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                        <div>
                             <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Storage</span>
                                <span className="text-white font-bold">{stats.systemHealth.storage}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-vision-secondary rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.systemHealth.storage}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Event Performance & Registrations */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Registrations Graph */}
                <div className="lg:col-span-3 bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6">
                    <p className="text-white font-bold text-lg mb-1">Registration Traffic</p>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-emerald-400 font-bold text-sm">
                            {(stats.trafficData[stats.trafficData.length-1] > stats.trafficData[stats.trafficData.length-2]) ? '(Rising)' : '(Stable)'}
                        </span>
                        <span className="text-gray-400 text-sm">vs last month</span>
                    </div>

                    <div className="h-64 mt-4 relative">
                        {/* Dynamic Wave Chart */}
                        <div className="absolute inset-0 flex items-end justify-between px-2 gap-2 z-10">
                             {stats.trafficData.map((val, i) => (
                                 <div key={i} className="w-full relative group flex flex-col justify-end items-center">
                                      {/* Tooltip */}
                                      <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-[#0B0F14] border border-white/10 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap transition-opacity pointer-events-none">
                                          {val} Regs ({stats.trafficLabels[i]})
                                      </div>

                                     <div className="w-full bg-gradient-to-t from-vision-primary/10 to-transparent rounded-t-lg relative overflow-hidden h-full"> 
                                        <div 
                                            className="absolute bottom-0 left-0 right-0 bg-vision-primary/30 group-hover:bg-vision-primary transition-colors rounded-t-sm"
                                            style={{ height: `${(val / (Math.max(...stats.trafficData, 1))) * 80}%` }}
                                        ></div>
                                     </div>
                                      <span className="text-[10px] text-gray-500 mt-2">{stats.trafficLabels[i]}</span>
                                 </div>
                             ))}
                        </div>
                         {/* SVG Curve Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20" viewBox="0 0 1000 350" preserveAspectRatio="none"> 
                            {/* Fill Gradient */}
                            <path 
                                d={fillPath} 
                                fill="url(#gradient)" 
                                opacity="0.2"
                            />
                            {/* Stroke Line */}
                            <path 
                                d={pathData} 
                                stroke="#6366F1" 
                                strokeWidth="3" 
                                fill="none"
                                vectorEffect="non-scaling-stroke"
                            />
                             <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.5"/>
                                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Event Distribution */}
                <div className="lg:col-span-2 bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6">
                    <h3 className="text-white font-bold text-lg mb-6">Upcoming Events</h3>
                    
                    <div className="space-y-4">
                        {stats.upcomingEvents.length === 0 ? (
                             <div className="text-gray-500 text-sm italic py-4 text-center">No upcoming events scheduled.</div>
                        ) : (
                            stats.upcomingEvents.map((event, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate(`/admin/events/${event.id}`)}>
                                    <div className={`w-2 h-12 rounded-full ${i % 2 === 0 ? 'bg-vision-primary' : 'bg-emerald-500'} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-sm group-hover:text-vision-primary transition-colors line-clamp-1">{event.title}</h4>
                                        <p className="text-gray-400 text-xs">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 border border-border px-2 py-1 rounded bg-white/5 uppercase tracking-wider">EVENT</span>
                                </div>
                            ))
                        )}
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
                            <p className="text-gray-400 text-sm"><span className="font-bold text-gray-300">{stats.recentActivity.length} recent</span> records</p>
                        </div>
                    </div>
                    <button className="p-2 text-vision-primary hover:bg-white/5 rounded-lg transition-colors" onClick={() => navigate('/admin/registrations')}>
                        <Terminal size={20} />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="text-[10px] text-gray-400 uppercase font-bold py-3 border-b border-gray-800">Event</th>
                                <th className="text-[10px] text-gray-400 uppercase font-bold py-3 border-b border-gray-800">User</th>
                                <th className="text-[10px] text-gray-400 uppercase font-bold py-3 border-b border-gray-800 text-center">Status</th>
                                <th className="text-[10px] text-gray-400 uppercase font-bold py-3 border-b border-gray-800">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentActivity.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-500 text-sm">No recent registrations found.</td>
                                </tr>
                            ) : (
                                stats.recentActivity.map((reg, i) => (
                                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 border-b border-gray-800/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-vision-primary/20 flex items-center justify-center text-vision-primary font-bold text-xs">
                                                    {reg.event_details?.title?.substring(0,2).toUpperCase() || "EV"}
                                                </div>
                                                <span className="text-white font-bold text-sm line-clamp-1 max-w-[150px]">{reg.event_details?.title || "Unknown Event"}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 border-b border-gray-800/50">
                                            <div className="flex flex-col">
                                                 <span className="text-white text-sm font-medium">{reg.user_details?.full_name || "Unknown User"}</span>
                                                 <span className="text-gray-500 text-xs">{reg.user_details?.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 border-b border-gray-800/50 text-center">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${reg.is_used ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {reg.is_used ? 'CHECKED IN' : 'REGISTERED'}
                                            </span>
                                        </td>
                                        <td className="py-4 border-b border-gray-800/50 max-w-[140px]">
                                            <span className="text-gray-400 text-xs">{new Date(reg.registration_date).toLocaleDateString()}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
