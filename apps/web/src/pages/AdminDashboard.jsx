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
    Database,
    Globe,
    Wifi,
    BarChart3,
    AlertCircle,
    Clock,
    Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            setStats(prev => ({
                ...prev,
                serverLoad: Math.floor(Math.random() * 40 + 20)
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, [token]);

    // Render Widget Helpers
    const StatBlock = ({ label, value, subtext, icon: Icon, color = "text-primary" }) => (
        <div className="bg-[#050505] border border-white/5 p-5 rounded-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={48} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 opacity-50">
                    <Icon size={14} className={color} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
                </div>
                <div className="text-3xl font-bold text-white font-mono tracking-tighter">
                    {value}
                </div>
                 {subtext && (
                    <div className="text-[10px] text-gray-500 mt-2 font-mono flex items-center gap-2">
                         <div className={`w-1 h-1 rounded-full ${color}`}></div>
                        {subtext}
                    </div>
                )}
            </div>
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20"></div>
        </div>
    );

    return (
        <div className="min-h-full space-y-4">
            {/* Top Stat Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBlock 
                    label="Total Operatives" 
                    value={loading ? "..." : stats.totalRegistrations} 
                    subtext="+4 NEW TODAY"
                    icon={Users}
                    color="text-blue-400"
                />
                <StatBlock 
                    label="Active Missions" 
                    value={loading ? "..." : stats.activeEvents} 
                    subtext="OPERATIONAL"
                    icon={Target}
                    color="text-emerald-400"
                />
                <StatBlock 
                    label="Field Access Rate" 
                    value={loading ? "..." : `${stats.attendanceRate}%`} 
                    subtext="WITHIN PARAMETERS"
                    icon={ShieldCheck}
                    color="text-amber-400"
                />
                <StatBlock 
                    label="Core Integrity" 
                    value={`${stats.serverLoad}%`} 
                    subtext="STABLE"
                    icon={Cpu}
                    color="text-rose-400"
                />
            </div>

            {/* Main Central Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[500px]">
                
                {/* Center Map / Geo View */}
                <div className="lg:col-span-2 bg-[#050505] border border-white/5 relative rounded-sm overflow-hidden flex flex-col">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50"></div>
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
                        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Globe size={14} className="text-blue-500" />
                            Global Activity Monitor
                        </h3>
                        <div className="flex gap-2">
                             <div className="px-2 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-mono border border-blue-500/20 rounded-sm">
                                LIVING MAP
                            </div>
                        </div>
                    </div>

                    {/* Faux Map Visuals */}
                    <div className="flex-1 relative flex items-center justify-center">
                        <div className="w-[80%] h-[70%] border border-blue-500/10 rounded-full flex items-center justify-center relative animate-[spin_60s_linear_infinite]">
                            <div className="w-[70%] h-[70%] border border-blue-500/10 rounded-full"></div>
                        </div>
                         <div className="w-[60%] h-[50%] border-x border-blue-500/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                         <div className="w-[80%] h-[1px] bg-blue-500/10 absolute top-1/2 left-1/2 -translate-x-1/2"></div>
                         
                         {/* Points */}
                         <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} 
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" 
                         />
                         <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} 
                            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                            className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" 
                         />

                        <div className="absolute bottom-4 left-4 font-mono text-[10px] text-blue-400/50 space-y-1">
                            <p>LAT: 28.6139° N</p>
                            <p>LNG: 77.2090° E</p>
                            <p>SEC: ENCRYPTED</p>
                        </div>
                    </div>
                </div>

                {/* Right Log Feed */}
                <div className="bg-[#050505] border border-white/5 flex flex-col rounded-sm overflow-hidden">
                     <div className="flex items-center justify-between p-4 border-b border-white/5 bg-black/40 backdrop-blur-md">
                        <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                            <Terminal size={14} />
                            Sys_Logs
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px]">
                        {loading ? (
                            <div className="text-center text-gray-600 animate-pulse">Establishing Uplink...</div>
                        ) : stats.logs.length === 0 ? (
                            <div className="text-center text-gray-600">No recent signatures.</div>
                        ) : (
                            stats.logs.map((log, i) => (
                                <div key={i} className="flex gap-3 items-start border-l border-white/5 pl-3 py-1 hover:bg-white/5 transition-colors cursor-default">
                                    <div className="text-gray-500 w-12 shrink-0">
                                        {new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </div>
                                    <div className="flex-1 text-gray-300">
                                        <span className={log.id % 2 === 0 ? 'text-emerald-500' : 'text-blue-500'}>
                                            {log.id % 2 === 0 ? '[AUTH]' : '[REG]'} 
                                        </span> 
                                        {' '}{log.user_name} initialized.
                                    </div>
                                </div>
                            ))
                        )}
                         <div className="flex gap-3 items-start border-l border-white/5 pl-3 py-1 opacity-50">
                            <div className="text-gray-500 w-12 shrink-0">11:13</div>
                            <div className="text-gray-500">System check completed. All green.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Controls / Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button 
                    onClick={() => navigate('/admin/events')}
                    className="group bg-[#080808] border border-white/5 p-4 flex items-center justify-between hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left"
                >
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wide text-sm mb-1 group-hover:text-blue-400">Initiate Event</h4>
                        <p className="text-[10px] text-gray-500 font-mono">Create new operation parameters</p>
                    </div>
                    <ArrowUpRight className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                </button>

                 <button 
                    onClick={() => navigate('/admin/scanner')}
                    className="group bg-[#080808] border border-white/5 p-4 flex items-center justify-between hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
                >
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wide text-sm mb-1 group-hover:text-emerald-400">Scanner Uplink</h4>
                        <p className="text-[10px] text-gray-500 font-mono">Connect field units</p>
                    </div>
                    <Crosshair className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
                </button>

                 <button 
                    onClick={() => navigate('/admin/gallery')}
                    className="group bg-[#080808] border border-white/5 p-4 flex items-center justify-between hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-left"
                >
                    <div>
                        <h4 className="text-white font-bold uppercase tracking-wide text-sm mb-1 group-hover:text-purple-400">Asset Database</h4>
                        <p className="text-[10px] text-gray-500 font-mono">Manage media archives</p>
                    </div>
                    <Database className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                </button>
            </div>
        </div>
    );
};

// Lucide icon alias fix if needed (Target not exported by default sometimes, use similar)
import { Target } from 'lucide-react';

export default AdminDashboard;
