import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
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
    ArrowUpRight
} from 'lucide-react';

const NotificationItem = ({ type, title, message, time, recipients, priority }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] hover:border-white/[0.2] transition-all group relative overflow-hidden"
    >
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105
                    ${priority === 'URGENT' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                      priority === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                    {priority === 'URGENT' ? <AlertTriangle size={18} /> : 
                     priority === 'SUCCESS' ? <CheckCircle size={18} /> : 
                     <Zap size={18} />}
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{recipients}</span>
                         <div className="w-1 h-1 rounded-full bg-slate-700" />
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${priority === 'URGENT' ? 'text-rose-500' : 'text-slate-500'}`}>{priority}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-white/[0.03] px-3 py-1.5 rounded-lg">
                <Clock size={12} />
                {time}
            </div>
        </div>
        <p className="text-slate-400 text-xs font-medium leading-relaxed pl-14 group-hover:text-slate-300 transition-colors">{message}</p>
        
        <div className="mt-4 pl-14 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
                Resend <ChevronRight size={12} />
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
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Communication</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider relative z-10">Notifications</h1>
                        <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">
                            Send announcements and alerts to platform users.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Compose Form */}
                <div className="lg:col-span-7 space-y-8">
                    <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500">
                                <Send size={20} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-white">Create New Notification</h3>
                                <p className="text-xs font-medium text-slate-500">Send a message to user groups</p>
                            </div>
                        </div>
                        
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Audience</label>
                                    <select 
                                        value={formData.audience}
                                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                                    >
                                        <option>All Registered Users</option>
                                        <option>Admins Only</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                                    <select 
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                                    >
                                        <option value="NORMAL">Normal</option>
                                        <option value="URGENT">Urgent</option>
                                        <option value="SUCCESS">Success/Confirmation</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                                <input 
                                    type="text" 
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="Brief title..."
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-white font-medium text-sm focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-slate-600"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
                                <textarea 
                                    rows="6"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="Write your message here..."
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 text-slate-300 font-medium text-sm focus:border-blue-500/50 focus:outline-none transition-all placeholder:text-slate-600 resize-none leading-relaxed"
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={sending}
                                    className="relative group overflow-hidden"
                                >
                                    <div className="relative h-12 px-8 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 transition-all hover:bg-blue-500 disabled:opacity-50">
                                        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                        {sending ? 'Sending...' : 'Send Notification'}
                                    </div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Recent History */}
                <div className="lg:col-span-5 flex flex-col h-full">
                    <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl relative overflow-hidden flex flex-col h-full min-h-[600px]">
                        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-black/40 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <History size={16} className="text-slate-400" />
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">History</h3>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar relative z-10">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-24 rounded-2xl bg-white/[0.03] animate-pulse" />
                                ))
                            ) : notifications.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4 py-20">
                                    <Bell size={40} />
                                    <span className="text-xs font-bold uppercase tracking-wider">No notifications sent</span>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
