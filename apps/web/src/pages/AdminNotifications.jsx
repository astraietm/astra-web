import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Send, 
    Bell, 
    CheckCircle, 
    AlertTriangle, 
    Clock, 
    Zap, 
    Users, 
    Loader2,
    History,
    ChevronRight,
    ArrowUpRight,
    Target,
    Activity,
    Radio,
    Signal,
    Database,
    SearchX
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const NotificationItem = ({ type, title, message, time, recipients, priority, index }) => (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.8 }}
        className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.02] hover:border-white/10 transition-all group relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-700 group-hover:scale-110
                    ${priority === 'URGENT' ? 'bg-rose-500/5 text-rose-500 border-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 
                      priority === 'SUCCESS' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 
                      'bg-blue-500/5 text-blue-500 border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]'}`}>
                    {priority === 'URGENT' ? <AlertTriangle size={22} /> : 
                     priority === 'SUCCESS' ? <CheckCircle size={22} /> : 
                     <Signal size={22} />}
                </div>
                <div className="space-y-1.5">
                    <h4 className="font-black text-white text-[11px] uppercase tracking-widest group-hover:text-blue-500 transition-colors">{title}</h4>
                    <div className="flex items-center gap-3">
                         <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">{recipients}</span>
                         <div className="w-1 h-1 rounded-full bg-slate-800" />
                         <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${priority === 'URGENT' ? 'text-rose-500' : 'text-slate-700'}`}>{priority}_PRIORITY</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-800 uppercase tracking-widest bg-white/[0.02] px-3 py-1.5 rounded-lg border border-white/[0.05] group-hover:text-slate-500 transition-colors">
                <Clock size={12} />
                {time}
            </div>
        </div>
        <p className="text-slate-400 text-[10px] font-medium leading-relaxed pl-20 group-hover:text-slate-300 transition-colors uppercase tracking-tight">{message}</p>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
    </motion.div>
);

const AdminNotifications = () => {
    const { token } = useAuth();
    const toast = useToast();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        audience: 'ALL_NODES',
        priority: 'NORMAL',
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchNotifications();
    }, [token]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/operations/notifications/`, {
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
            await axios.post(`${API_URL}/operations/notifications/`, {
                subject: formData.subject,
                message: formData.message,
                priority: formData.priority,
                recipients_criteria: formData.audience
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setFormData({ ...formData, subject: '', message: '' });
            toast.success('Signal broadcast dispatched successfully.');
            fetchNotifications(); 
        } catch (error) {
            toast.error('Signal dispatch protocol failure.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">Broadcast_Center</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Signal_Broadcaster</h1>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono uppercase tracking-tight">
                            Active_Uplinks: <span className="text-blue-500">REALTIME_ENABLED</span> // Dispatched_Clusters: <span className="text-white">{notifications.length}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Compose Form */}
                <div className="xl:col-span-7 space-y-10">
                    <div className="bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.01] to-transparent pointer-events-none" />
                        
                        <div className="flex items-center gap-6 mb-12 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-600/5 border border-blue-600/10 flex items-center justify-center text-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.1)] group-hover:scale-105 transition-transform duration-700">
                                <Radio size={24} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Synthesize_Signal</h3>
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Configure_Broadcast_Parameters</p>
                            </div>
                        </div>
                        
                        <form className="space-y-10 relative z-10" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Target_Cluster</label>
                                    <select 
                                        value={formData.audience}
                                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                                        className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-4.5 py-4 text-[11px] font-black text-white focus:outline-none focus:border-blue-500/30 transition-all cursor-pointer uppercase tracking-widest"
                                    >
                                        <option value="ALL_NODES">All_Registered_Nodes</option>
                                        <option value="ADMIN_ROOT">Command_Level_Admins</option>
                                        <option value="VOL_UNITS">Operational_Volunteers</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Priority_Protocol</label>
                                    <select 
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-4.5 py-4 text-[11px] font-black text-white focus:outline-none focus:border-blue-500/30 transition-all cursor-pointer uppercase tracking-widest"
                                    >
                                        <option value="NORMAL">Normal_Status</option>
                                        <option value="URGENT">Urgent_Intercept</option>
                                        <option value="SUCCESS">Auth_Confirmation</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Signal_Header</label>
                                <input 
                                    type="text" 
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="BROADCAST_IDENTIFIER..."
                                    className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-sm font-black text-white placeholder:text-slate-900 focus:border-blue-500/30 focus:outline-none transition-all uppercase tracking-widest"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Data_Payload</label>
                                <textarea 
                                    rows="6"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="ENCODE_MESSAGE_CONTENT..."
                                    className="w-full bg-white/[0.01] border border-white/[0.05] rounded-[2rem] p-6 text-slate-400 font-medium text-xs focus:border-blue-500/30 focus:outline-none transition-all placeholder:text-slate-900 resize-none leading-relaxed uppercase"
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={sending}
                                className="w-full h-16 bg-blue-600 rounded-[1.5rem] text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 disabled:opacity-30 disabled:translate-y-0"
                            >
                                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} strokeWidth={3} />}
                                {sending ? 'DISPATCHING_SIGNAL' : 'EXECUTE_BROADCAST'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Recent History */}
                <div className="xl:col-span-5 flex flex-col h-full min-h-[600px]">
                    <div className="bg-white/[0.01] border border-white/[0.03] rounded-[3rem] relative overflow-hidden flex flex-col h-full group/history">
                        <div className="p-8 border-b border-white/[0.03] flex items-center justify-between bg-black/40 backdrop-blur-3xl sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center text-blue-500">
                                    <Activity size={16} />
                                </div>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">SIGNAL_ARCHIVE</h3>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar relative z-10">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-32 rounded-[2rem] bg-white/[0.01] border border-white/[0.03] animate-pulse" />
                                ))
                            ) : notifications.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-8 py-20">
                                    <SearchX size={60} strokeWidth={1} />
                                    <div className="space-y-2 text-center">
                                        <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">NO_SIGNALS_RECORDED</p>
                                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Archive_Ready_For_Data</p>
                                    </div>
                                </div>
                            ) : (
                                notifications.map((notif, idx) => (
                                    <NotificationItem 
                                        key={notif.id}
                                        index={idx}
                                        priority={notif.priority}
                                        title={notif.subject}
                                        message={notif.message}
                                        time={new Date(notif.created_at).toLocaleDateString()}
                                        recipients={notif.recipients_criteria}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
