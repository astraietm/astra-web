import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    Calendar, 
    ShieldCheck, 
    Activity, 
    Mail, 
    Terminal,
    ArrowUpRight,
    Search,
    Cpu,
    Zap,
    Server,
    Database
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import New Modular Widgets
import KPICard from '../components/admin/dashboard/KPICard';
import TrafficChart from '../components/admin/dashboard/TrafficChart';
import RecentActivityTable from '../components/admin/dashboard/RecentActivityTable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalRegistrations: 0,
        activeEvents: 0,
        recentActivity: [],
        upcomingEvents: [],
        trafficData: [], 
        trafficLabels: [], 
        attendanceRate: 0,
        systemHealth: {
            dbLoad: 12, // Default aesthetic values
            latency: 24,
            storage: 45
        }
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            
            // Generate labels
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

            // Sort & filter events
            const sortedEvents = Array.isArray(events) 
                ? [...events].sort((a,b) => new Date(a.date) - new Date(b.date)).filter(e => new Date(e.date) >= new Date())
                : [];

            setStats(prev => ({
                ...prev,
                totalRegistrations: Array.isArray(regs) ? regs.length : 0,
                activeEvents: Array.isArray(events) ? events.filter(e => e.is_registration_open).length : 0,
                upcomingEvents: sortedEvents.slice(0, 4),
                recentActivity: Array.isArray(regs) ? regs.slice(0, 10) : [], // Show more logs
                trafficData: trafficCounts,
                trafficLabels: trafficLabels,
                attendanceRate: Array.isArray(regs) && regs.length > 0 ? Math.round((attended / regs.length) * 100) : 0,
                // Simulate dynamic system health
                systemHealth: {
                    dbLoad: Math.floor(Math.random() * 20) + 10,
                    latency: Math.floor(Math.random() * 50) + 15,
                    storage: 42
                }
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

    // Quick Action Handler
    const handleQuickAction = (path) => {
        navigate(path);
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Context/Welcome Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white font-orbitron tracking-tight mb-1">
                        Command Center
                    </h1>
                    <p className="text-gray-400 text-sm font-mono flex items-center gap-2">
                        <Terminal size={14} className="text-vision-primary" />
                        SYSTEM_READY // WELCOME COMMANDER {user?.name?.toUpperCase() || 'USER'}
                    </p>
                </div>
                
                {/* System Ticker */}
                <div className="hidden lg:flex items-center gap-6 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        <Server size={12} className="text-emerald-400" />
                        <span>SERVER: ONLINE</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/10" />
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        <Database size={12} className="text-vision-primary" />
                        <span>DB_LATENCY: {stats.systemHealth.latency}ms</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/10" />
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        <Cpu size={12} className="text-amber-400" />
                        <span>LOAD: {stats.systemHealth.dbLoad}%</span>
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard 
                    title="Total Registrations" 
                    value={stats.totalRegistrations} 
                    icon={Users} 
                    trend="up" 
                    trendValue="+12%" 
                    isPrimary={true}
                    isLoading={loading}
                />
                <KPICard 
                    title="Active Events" 
                    value={stats.activeEvents} 
                    icon={Calendar} 
                    trend="up" 
                    trendValue="+2" 
                    isLoading={loading}
                />
                <KPICard 
                    title="Attendance Rate" 
                    value={`${stats.attendanceRate}%`} 
                    icon={ShieldCheck} 
                    trend="down" 
                    trendValue="-2%" 
                    isLoading={loading}
                />
                <KPICard 
                    title="System Status" 
                    value={error ? "Error" : "Healthy"} 
                    icon={Activity} 
                    trend="up" 
                    trendValue="Optimal" 
                    isLoading={loading}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Chart Section */}
                <div className="lg:col-span-2 space-y-6">
                    <TrafficChart 
                        data={stats.trafficData} 
                        labels={stats.trafficLabels} 
                        isLoading={loading} 
                    />

                    {/* Quick Actions Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: 'Create Event', icon: Calendar, path: '/admin/events', color: 'text-vision-primary' },
                            { label: 'Broadcast', icon: Mail, path: '/admin/notifications', color: 'text-emerald-400' },
                            { label: 'Audit Logs', icon: ShieldCheck, path: '/admin/logs', color: 'text-amber-400' },
                            { label: 'Settings', icon: Cpu, path: '/admin/settings', color: 'text-rose-400' }
                        ].map((action, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleQuickAction(action.path)}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-vision-card backdrop-blur-xl border border-white/5 transition-all group"
                            >
                                <div className={`p-3 rounded-full bg-white/5 mb-3 group-hover:bg-white/10 transition-colors ${action.color}`}>
                                    <action.icon size={20} />
                                </div>
                                <span className="text-xs font-bold text-gray-300 font-inter uppercase tracking-wide">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Column: Upcoming Events & System Health */}
                <div className="space-y-6">
                    {/* Events List */}
                    <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 h-full min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-bold text-lg font-orbitron tracking-wide">Operations</h3>
                            <button onClick={() => navigate('/admin/events')} className="text-xs text-vision-primary hover:text-white transition-colors uppercase font-bold tracking-wider">View All</button>
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                [1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />)
                            ) : stats.upcomingEvents.length === 0 ? (
                                <div className="text-center py-10 text-gray-500 text-sm font-mono border-2 border-dashed border-white/5 rounded-xl">
                                    NO_ACTIVE_OPERATIONS
                                </div>
                            ) : (
                                stats.upcomingEvents.map((event, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => navigate(`/admin/events/${event.id}`)}
                                        className="group p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-vision-primary/30 cursor-pointer transition-all flex items-center gap-4"
                                    >
                                        {/* Date Box */}
                                        <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#0B0F14] rounded-lg border border-white/10 group-hover:border-vision-primary/50 transition-colors">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-lg font-bold text-white leading-none">{new Date(event.date).getDate()}</span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-bold text-sm truncate group-hover:text-vision-primary transition-colors">{event.title}</h4>
                                            <p className="text-gray-500 text-[10px] font-mono truncate mt-0.5 uppercase tracking-wider">{event.category || 'EVENT'}</p>
                                        </div>

                                        <div className={`w-2 h-2 rounded-full ${i===0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`} />
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Recent Activity */}
            <RecentActivityTable registrations={stats.recentActivity} isLoading={loading} />
        </div>
    );
};

export default AdminDashboard;
