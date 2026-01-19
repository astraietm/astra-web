import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    Calendar, 
    ShieldCheck, 
    Activity, 
    ArrowUpRight,
    Search,
    Cpu,
    Zap,
    Globe,
    Target,
    Database,
    Crosshair
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
            setStats(prev => ({ ...prev, serverLoad: Math.floor(Math.random() * 40 + 20) }));
        }, 3000);
        return () => clearInterval(interval);
    }, [token]);

    // Render Widget Helpers
    const HoloCard = ({ label, value, subtext, icon: Icon, color = "text-indigo-400", border = "border-indigo-500/30" }) => (
        <div className={`relative group p-6 rounded-2xl bg-[#08080a] border ${border} overflow-hidden`}>
            {/* Dynamic Background */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color.replace('text-', 'bg-')}/10 blur-[40px] group-hover:blur-[60px] transition-all duration-500`} />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                        <span className="text-xs font-rajdhani font-semibold text-gray-500 uppercase tracking-widest mb-1">{label}</span>
                         <span className={`text-4xl font-bold font-rajdhani text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                            {value}
                        </span>
                    </div>
                    <div className={`p-3 rounded-lg bg-white/5 border border-white/5 ${color} shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]`}>
                        <Icon size={24} />
                    </div>
                </div>
                
                {subtext && (
                    <div className="flex items-center gap-2">
                         <div className={`h-0.5 w-4 rounded-full ${color.replace('text-', 'bg-')}`} />
                         <span className="text-[10px] font-mono text-gray-400 uppercase">{subtext}</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-full space-y-8 animate-fade-in-up pb-10">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                <div>
                   <h1 className="text-5xl font-bold font-rajdhani text-white tracking-tight mb-2">
                       COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">CENTER</span>
                   </h1>
                   <div className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-xs font-mono">SYS.VER.2.0.4</span>
                        <span>Welcome back, Commander {user?.name || 'Admin'}</span>
                   </div>
                </div>
                <div className="flex gap-3">
                   {/* Date Display */}
                   <div className="hidden lg:flex flex-col items-end mr-6 font-rajdhani">
                        <span className="text-2xl font-bold text-white">{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})}</span>
                   </div>
                   
                    <button className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm text-gray-300 font-rajdhani font-semibold tracking-wide">
                        <Zap size={16} className="text-amber-400" />
                        DIAGNOSTICS
                    </button>
                    <button className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center gap-2 text-sm text-white font-rajdhani font-bold tracking-wide shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
                        <Activity size={16} />
                        LIVE MONITOR
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <HoloCard 
                    label="Operatives Registered" 
                    value={loading ? "..." : stats.totalRegistrations} 
                    subtext="Real-time Database"
                    icon={Users}
                    color="text-blue-400"
                    border="border-blue-500/20"
                />
                <HoloCard 
                    label="Active Missions" 
                    value={loading ? "..." : stats.activeEvents} 
                    subtext="Deployed Units"
                    icon={Target}
                    color="text-emerald-400"
                    border="border-emerald-500/20"
                />
                <HoloCard 
                    label="Gate Access" 
                    value={loading ? "..." : `${stats.attendanceRate}%`} 
                    subtext="Security Clearance"
                    icon={ShieldCheck}
                    color="text-amber-400"
                    border="border-amber-500/20"
                />
                <HoloCard 
                    label="Server Load" 
                    value={`${stats.serverLoad}%`} 
                    subtext="Core Temperature Stabilized"
                    icon={Cpu}
                    color="text-rose-400"
                    border="border-rose-500/20"
                />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[450px]">
                
                {/* Network Traffic Visualization (Replacing Map) */}
                <div className="lg:col-span-2 relative rounded-2xl bg-[#08080a] border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <div>
                            <h3 className="font-rajdhani font-bold text-lg text-white flex items-center gap-2">
                                <Globe size={18} className="text-indigo-400" />
                                NETWORK TRAFFIC
                            </h3>
                        </div>
                         <div className="flex gap-2">
                            {['REQ', 'RES', 'ERR'].map(t => (
                                <span key={t} className="text-[10px] font-mono text-gray-500 px-2 py-1 rounded bg-white/5">{t}</span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Visualizer Area */}
                    <div className="flex-1 relative flex items-end justify-center gap-1 px-8 pb-0 overflow-hidden">
                        {/* Faux Bar Graph */}
                        {Array.from({ length: 40 }).map((_, i) => (
                             <motion.div 
                                key={i}
                                initial={{ height: '10%' }}
                                animate={{ height: [`${Math.random() * 60 + 10}%`, `${Math.random() * 60 + 10}%`] }}
                                transition={{ duration: 0.5 + Math.random(), repeat: Infinity, repeatType: 'reverse' }}
                                className={`w-full max-w-[12px] rounded-t-sm opacity-60 ${i % 3 === 0 ? 'bg-indigo-500' : 'bg-blue-600/50'}`}
                             />
                        ))}
                         
                         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 border-t border-dashed border-white/20" />
                         <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/5 border-t border-dashed border-white/10" />
                    </div>
                </div>

                {/* Log Feed */}
                <div className="rounded-2xl bg-[#08080a] border border-white/5 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                        <h3 className="font-rajdhani font-bold text-lg text-white flex items-center gap-2">
                            <Activity className="text-emerald-400" size={18} />
                            SYS_LOGS
                        </h3>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                        ) : (
                            stats.logs.map((log, i) => (
                                <div key={i} className="group p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.02] transition-all flex gap-3">
                                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-sm shrink-0 ${log.id % 2 === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold font-rajdhani text-gray-200 truncate group-hover:text-white transition-colors">
                                            {log.user_name}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">
                                            ID: #{log.id.toString().padStart(4, '0')} • {log.id % 2 === 0 ? 'AUTH_SUCCESS' : 'REG_NEW'}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-gray-600 ml-auto whitespace-nowrap font-mono mt-0.5">
                                        {new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

             {/* Footer Actions */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: 'DEPLOY EVENT', desc: 'Initialize New Mission Protocol', icon: Calendar, color: 'text-blue-400', to: '/admin/events' },
                    { title: 'SCANNER UPLINK', desc: 'Connect Field Operative Units', icon: Crosshair, color: 'text-emerald-400', to: '/admin/scanner' },
                    { title: 'ASSET ARCHIVES', desc: 'Manage Encrypted Media Files', icon: Database, color: 'text-purple-400', to: '/admin/gallery' },
                ].map((action, i) => (
                    <button 
                        key={i}
                        onClick={() => navigate(action.to)}
                        className="group relative h-24 rounded-2xl overflow-hidden bg-[#0a0a0c] border border-white/5 hover:border-white/10 transition-all flex items-center px-6 gap-5"
                    >
                         <div className={`p-4 rounded-xl bg-white/5 ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                             <action.icon size={26} />
                         </div>
                         <div className="text-left">
                             <h4 className="font-rajdhani font-bold text-white tracking-wide text-lg group-hover:text-indigo-300 transition-colors">{action.title}</h4>
                             <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{action.desc}</p>
                         </div>
                         
                         {/* Hover Gradient */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>
                ))}
             </div>

        </div>
    );
};

export default AdminDashboard;
