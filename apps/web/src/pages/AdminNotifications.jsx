import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, 
    Send, 
    Bell, 
    CheckCircle, 
    AlertTriangle, 
    Clock, 
    Zap, 
    Users, 
    Shield, 
    Cpu, 
    Target,
    Loader2,
    History,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

const NotificationItem = ({ type, title, message, time, recipients, priority }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.02] hover:border-white/10 transition-all group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-[40px] pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner border transition-transform group-hover:scale-110
                    ${priority === 'URGENT' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5' : 
                      priority === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5' : 
                      'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5'}`}>
                    {priority === 'URGENT' ? <AlertTriangle size={20} /> : 
                     priority === 'SUCCESS' ? <CheckCircle size={20} /> : 
                     <Zap size={20} />}
                </div>
                <div>
                    <h4 className="font-black text-white text-[13px] uppercase tracking-tight group-hover:text-blue-400 transition-colors">{title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{recipients} NODES REACHED</span>
                         <div className="w-1 h-1 rounded-full bg-slate-800" />
                         <span className={`text-[8px] font-black uppercase tracking-widest ${priority === 'URGENT' ? 'text-rose-500' : 'text-slate-500'}`}>{priority}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-700 uppercase tracking-widest bg-white/[0.02] px-3 py-1.5 rounded-xl border border-white/5">
                <Clock size={12} className="text-blue-500" />
                {time}
            </div>
        </div>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed pl-16 group-hover:text-slate-200 transition-colors">{message}</p>
        
        <div className="mt-6 pl-16 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors">
                RESEND_SEQUENCE <ChevronRight size={10} />
            </button>
        </div>
    </motion.div>
);

const AdminNotifications = () => {
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        audience: 'All Registered Users',
        priority: 'NORMAL',
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchNotifications();
    }, [token]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_URL}/ops/notifications/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!formData.subject || !formData.message) return;
        
        setSending(true);
        try {
            await axios.post(`${API_URL}/ops/notifications/`, {
                subject: formData.subject,
                message: formData.message,
                priority: formData.priority,
                recipients_criteria: formData.audience
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setFormData({ ...formData, subject: '', message: '' });
            fetchNotifications(); 
            alert('Notification dispatched successfully!');
        } catch (error) {
            console.error("Failed to send notification", error);
            alert('Failed to dispatch notification.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-16 pb-20">
            {/* Mission Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Broadcast Uplink Terminal</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Global Comms</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Dispatch Node</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Broadcasting mission-critical directives to synchronized personnel.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Compose Matrix */}
                <div className="lg:col-span-7 space-y-10">
                    <div className="bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] p-10 relative overflow-hidden group">
                         <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
                        </div>

                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                                <Send size={24} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">Construct Blast</h3>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">High-Priority Directives</p>
                            </div>
                        </div>
                        
                        <form className="space-y-10 relative z-10" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Target Sector</label>
                                    <select 
                                        value={formData.audience}
                                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                                        className="w-full bg-black/40 border border-white/[0.05] rounded-2xl p-5 text-[11px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-blue-500/30 transition-all cursor-pointer appearance-none"
                                    >
                                        <option>All Registered Users</option>
                                        <option>Admins Only</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Priority LVL</label>
                                    <select 
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="w-full bg-black/40 border border-white/[0.05] rounded-2xl p-5 text-[11px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-blue-500/30 transition-all cursor-pointer appearance-none"
                                    >
                                        <option value="NORMAL">INFO_STREAM</option>
                                        <option value="URGENT">URGENT_EVAC</option>
                                        <option value="SUCCESS">SYSTEM_STABLE</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Directive Header</label>
                                <input 
                                    type="text" 
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="E.G. MANDATORY_SYNC_PROTOCOL"
                                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 text-white font-black uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:bg-white/[0.04] focus:outline-none transition-all placeholder:text-slate-800"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Blast Content</label>
                                <textarea 
                                    rows="8"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="INPUT DIRECTIVE DATA..."
                                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-[2.5rem] p-8 text-slate-300 font-bold uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:bg-white/[0.04] focus:outline-none transition-all placeholder:text-slate-800 resize-none leading-relaxed"
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={sending}
                                    className="relative group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative h-20 px-12 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[2.5rem] flex items-center gap-4 transition-all group-active:scale-95 disabled:grayscale disabled:opacity-50">
                                        <Zap size={20} className="fill-white animate-pulse" />
                                        {sending ? 'Uplinking...' : 'Commit Dispatch'}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* History Stream */}
                <div className="lg:col-span-5 flex flex-col h-full">
                    <div className="bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] relative overflow-hidden flex flex-col h-full min-h-[700px]">
                        <div className="p-10 border-b border-white/[0.04] flex items-center justify-between bg-black/20 relative z-10">
                            <div className="flex items-center gap-4">
                                <History size={20} className="text-slate-600" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Archive</h3>
                            </div>
                            <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Sequence: 001 - 049</span>
                        </div>
                        
                        <div className="p-8 space-y-4 overflow-y-auto flex-1 custom-scrollbar relative z-10">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-32 rounded-[2rem] bg-white/[0.01] border border-white/[0.03] animate-pulse" />
                                ))
                            ) : notifications.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4 py-20">
                                    <Bell size={60} strokeWidth={1} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">No Dispatches Logged</span>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <NotificationItem 
                                        key={notif.id}
                                        priority={notif.priority}
                                        title={notif.subject}
                                        message={notif.message}
                                        time={new Date(notif.created_at).toLocaleDateString()}
                                        recipients={notif.recipients_criteria}
                                    />
                                ))
                            )}
                        </div>

                        <div className="p-10 border-t border-white/[0.04] bg-black/40 relative z-10 text-center">
                             <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em]">Integrated Astra Telemetry System v2.6.0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
