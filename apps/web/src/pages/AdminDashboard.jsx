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

    const GlassStatCard = ({ label, value, subtext, icon: Icon, gradient }) => (
        <div className="relative group p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-white/0 overflow-hidden isolate">
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
            
            <div className="bg-[#050505]/80 backdrop-blur-xl h-full rounded-[23px] p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={24} />
                    </div>
                    {subtext && (
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider backdrop-blur-sm">
                            {subtext}
                        </div>
                    )}
                </div>
                
                <div>
                    <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</h4>
                    <div className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-2">
                        {value}
                        <span className="text-sm font-normal text-gray-500 opacity-50">/ UNIT</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-full space-y-8 animate-fade-in-up">
            
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div>
                   <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 pb-2">
                       Mission Control
                   </h1>
                   <p className="text-gray-400 font-medium">Welcome back, Commander {user?.name || 'Admin'} </p>
                </div>
                <div className="hidden md:flex gap-3">
                    <button className="px-4 py-2 rounded-xl bg-white/5 text-sm font-medium hover:bg-white/10 transition-colors border border-white/5">
                        System Diagnostics
                    </button>
                    <button className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 text-sm font-medium hover:bg-indigo-600/30 transition-colors border border-indigo-500/20 flex items-center gap-2">
                        <Zap size={16} fill="currentColor" />
                        Live Status
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassStatCard 
                    label="Total Operatives" 
                    value={loading ? "..." : stats.totalRegistrations} 
                    subtext="+12%"
                    icon={Users}
                    gradient="from-blue-500 to-indigo-500"
                />
                <GlassStatCard 
                    label="Active Missions" 
                    value={loading ? "..." : stats.activeEvents} 
                    subtext="ONLINE"
                    icon={Target}
                    gradient="from-emerald-500 to-teal-500"
                />
                <GlassStatCard 
                    label="Access Granted" 
                    value={loading ? "..." : `${stats.attendanceRate}%`} 
                    subtext="SECURE"
                    icon={ShieldCheck}
                    gradient="from-amber-500 to-orange-500"
                />
                <GlassStatCard 
                    label="System Load" 
                    value={`${stats.serverLoad}%`} 
                    subtext="STABLE"
                    icon={Cpu}
                    gradient="from-rose-500 to-pink-500"
                />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                
                {/* 3D Global Map Simulation */}
                <div className="lg:col-span-2 relative rounded-3xl bg-[#080808] border border-white/5 overflow-hidden isolate shadow-2xl">
                     {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

                    {/* Header */}
                    <div className="absolute top-6 left-6 z-20">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <Globe className="text-indigo-400" size={20} />
                            Active Surveillance
                        </h3>
                        <p className="text-gray-500 text-xs mt-1">Real-time global event tracking</p>
                    </div>

                    <div className="absolute top-6 right-6 z-20 flex gap-2">
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            LIVE FEED
                        </div>
                    </div>

                    {/* Central Globe Graphic */}
                    <div className="absolute inset-0 flex items-center justify-center">
                         {/* Orbital Rings */}
                        <div className="w-[400px] h-[400px] rounded-full border border-white/[0.03] animate-[spin_20s_linear_infinite]" />
                        <div className="absolute w-[550px] h-[550px] rounded-full border border-white/[0.02] animate-[spin_30s_linear_infinite_reverse]" />
                        
                        {/* Globe Sphere */}
                        <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-500/20 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative backdrop-blur-sm overflow-hidden flex items-center justify-center">
                              {/* Grid Lines on Globe */}
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 transform rotate-12 scale-[1.2]" />
                              
                              {/* Glowing Core */}
                              <div className="w-full h-full bg-radial-gradient from-indigo-500/20 via-transparent to-transparent opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Right Feed Panel */}
                <div className="rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col backdrop-blur-xl overflow-hidden relative">
                    <div className="p-6 border-b border-white/5 bg-white/[0.01]">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <Activity className="text-orange-400" size={18} />
                            System Activity
                        </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
                        ) : (
                            stats.logs.map((log, i) => (
                                <div key={i} className="flex gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-default group">
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${log.id % 2 === 0 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'}`} />
                                    <div>
                                        <p className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors">
                                            {log.user_name}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            Authenticated via {log.id % 2 === 0 ? 'QR Scan' : 'Manual Entry'}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-gray-600 ml-auto whitespace-nowrap font-mono mt-1">
                                        {new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            ))
                        )}
                        <div className="p-3 text-center text-xs text-gray-600 uppercase tracking-widest font-medium">End of Log</div>
                    </div>
                </div>
            </div>

             {/* Quick Actions Actions */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Create Event', desc: 'Deploy new mission parameters', icon: Calendar, color: 'text-blue-400', to: '/admin/events' },
                    { title: 'Scanner Link', desc: 'Connect to field operatives', icon: Crosshair, color: 'text-emerald-400', to: '/admin/scanner' },
                    { title: 'Media Assets', desc: 'Manage mission archives', icon: Database, color: 'text-purple-400', to: '/admin/gallery' },
                ].map((action, i) => (
                    <button 
                        key={i}
                        onClick={() => navigate(action.to)}
                        className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/10 to-white/0 hover:scale-[1.01] transition-transform duration-300"
                    >
                         <div className="bg-[#080808] p-5 rounded-[15px] h-full flex items-center gap-4 relative z-10">
                              <div className={`p-3 rounded-xl bg-white/5 text-gray-300 group-hover:text-white group-hover:bg-white/10 transition-colors ${action.color}`}>
                                  <action.icon size={24} />
                              </div>
                              <div className="text-left">
                                  <h4 className="text-white font-bold text-sm tracking-wide group-hover:text-indigo-300 transition-colors">{action.title}</h4>
                                  <p className="text-xs text-gray-500">{action.desc}</p>
                              </div>
                              <ArrowUpRight className="ml-auto text-gray-700 group-hover:text-indigo-400 transition-colors" size={18} />
                         </div>
                    </button>
                ))}
             </div>

        </div>
    );
};

export default AdminDashboard;
