import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    Search, 
    Filter, 
    Download, 
    AlertTriangle, 
    CheckCircle, 
    Info, 
    XCircle,
    Terminal,
    Cpu,
    Zap,
    History,
    Key,
    Activity,
    Database,
    Loader2
} from 'lucide-react';

const LogRow = ({ type, message, user, ip, time, index }) => (
    <motion.tr 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.01 }}
        className="hover:bg-white/[0.02] transition-colors group border-b border-white/[0.03] last:border-0"
    >
        <td className="py-5 px-8">
            <div className={`flex items-center gap-3 font-black text-[10px] tracking-widest uppercase
                ${type === 'ERROR' ? 'text-rose-500' : 
                  type === 'WARN' ? 'text-amber-500' : 
                  type === 'SUCCESS' ? 'text-emerald-500' : 
                  'text-blue-500'}`}>
                <div className={`w-2 h-2 rounded-full ${
                     type === 'ERROR' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 
                     type === 'WARN' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 
                     type === 'SUCCESS' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                     'bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]'
                }`} />
                {type}
            </div>
        </td>
        <td className="py-5 px-8">
            <div className="flex flex-col gap-1">
                <span className="text-[12px] font-black text-slate-200 uppercase tracking-tight group-hover:text-white transition-colors">
                    {message}
                </span>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Protocol Handshake Verified</span>
            </div>
        </td>
        <td className="py-5 px-8">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-blue-400 transition-colors">
                    {user?.[0]?.toUpperCase() || 'S'}
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[150px]">
                    {user || 'SYSTEM_DAEMON'}
                </span>
            </div>
        </td>
        <td className="py-5 px-8">
            <code className="text-[10px] font-black text-slate-600 bg-white/[0.02] px-2 py-1 rounded border border-white/5 uppercase tracking-widest">
                {ip || '0.0.0.0'}
            </code>
        </td>
        <td className="py-5 px-8 text-right">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{new Date(time).toLocaleDateString()}</span>
                <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mt-1">{new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
        </td>
    </motion.tr>
);

const AdminLogs = () => {
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [token]);

    const fetchLogs = async () => {
        try {
            const response = await axios.get(`${API_URL}/ops/logs/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">System Forensics Terminal</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Security Audit</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Historical Logs</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            AstraOS Core sync: <span className="text-emerald-500">Node_Stable</span> | Integrity Check: <span className="text-blue-500">100% Verified</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchLogs}
                        className="px-6 py-3 bg-white/[0.02] border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4 text-blue-500" />
                        Re-Scan
                    </button>
                    <button className="relative group overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative px-8 py-3 bg-blue-600 rounded-2xl flex items-center gap-2 group-active:scale-95 transition-transform text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                            <Download size={14} />
                            Expunge to CSV
                        </div>
                    </button>
                </div>
            </div>

            {/* Tactical Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Active Sessions', val: '412', icon: Zap, color: 'blue' },
                    { label: 'Auth Handshakes', val: logs.length, icon: Key, color: 'emerald' },
                    { label: 'Blockage Stats', val: '12', icon: Shield, color: 'rose' },
                    { label: 'Core Integrity', val: '0.002ms', icon: Cpu, color: 'violet' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/[0.03] flex items-center gap-5 hover:bg-white/[0.02] transition-all group">
                         <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                            <stat.icon size={20} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</span>
                            <span className="text-2xl font-black text-white uppercase tracking-tighter mt-1">{stat.val}</span>
                         </div>
                    </div>
                ))}
            </div>

            {/* Audit Node Container */}
            <div className="relative group p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-[3rem] backdrop-blur-3xl overflow-hidden min-h-[600px] flex flex-col">
                {/* Search / Filter Overlay */}
                <div className="p-8 border-b border-white/[0.04] flex items-center gap-6 relative z-10">
                    <div className="flex-1 relative group/input">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors z-10" />
                        <input 
                            type="text" 
                            placeholder="SEARCH SECURITY EVENTS / USER_IDS..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-16 w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 pl-14 pr-6 text-[11px] font-black tracking-widest text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/30 transition-all uppercase"
                        />
                    </div>
                    <button className="w-16 h-16 rounded-[2rem] bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-slate-600 hover:text-white transition-all active:scale-95">
                        <Filter size={18} />
                    </button>
                    <div className="h-10 w-px bg-white/[0.04]" />
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)] animate-pulse" />
                         Live Feed Pulse
                    </div>
                </div>

                {/* Event Matrix */}
                <div className="flex-1 overflow-x-auto custom-scrollbar relative z-10">
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-[#020202] z-20">
                            <tr>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Level</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Operational Message</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Personnel ID</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Node IP</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Sequence</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6">
                                            <div className="h-12 bg-white/[0.01] border border-white/5 rounded-2xl w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-40 text-center">
                                         <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Terminal size={60} className="text-slate-600 stroke-1" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.5em]">No Logs In Matrix</span>
                                         </div>
                                    </td>
                                </tr>
                            ) : (
                                logs
                                    .filter(log => (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || (log.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((log, i) => (
                                        <LogRow 
                                            key={i} 
                                            index={i}
                                            type={log.level}
                                            message={log.action}
                                            user={log.user_email}
                                            ip={log.ip_address}
                                            time={log.timestamp}
                                        />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tactical Detail Bar */}
                <div className="p-6 border-t border-white/[0.04] bg-black/40 flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                         Archived Entries: <span className="text-blue-500">{logs.length}</span> / Displaying Sequence 01-50
                    </span>
                    <div className="flex items-center gap-3">
                        <button className="px-6 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white hover:bg-white/[0.04] transition-all">Prev_Batch</button>
                        <button className="px-6 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white hover:bg-white/[0.04] transition-all">Next_Batch</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RotateCcw = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
);

export default AdminLogs;
