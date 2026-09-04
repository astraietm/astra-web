import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    Send, 
    Bell, 
    CheckCircle2, 
    AlertTriangle, 
    Clock, 
    Users, 
    Loader2,
    SearchX,
    ShieldAlert,
    Info,
    RefreshCw
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/admin/common/PageHeader';
import StatusBadge from '../components/admin/common/StatusBadge';
import EmptyState from '../components/admin/common/EmptyState';

const AdminNotifications = () => {
    const { token } = useAuth();
    const toast = useToast();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        audience: 'ALL_USERS',
        priority: 'NORMAL',
        subject: '',
        message: ''
    });

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/operations/notifications/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [token]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!formData.subject.trim() || !formData.message.trim()) {
            toast?.error?.('Please provide both a subject and a message.');
            return;
        }
        
        setSending(true);
        try {
            await axios.post(`${API_URL}/operations/notifications/`, {
                subject: formData.subject.trim(),
                message: formData.message.trim(),
                priority: formData.priority,
                recipients_criteria: formData.audience
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setFormData({ audience: 'ALL_USERS', priority: 'NORMAL', subject: '', message: '' });
            toast?.success?.('Announcement sent successfully.');
            fetchNotifications(); 
        } catch (error) {
            console.error('Failed to send announcement:', error);
            toast?.error?.('Failed to send announcement. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'URGENT':
                return <StatusBadge status="error" label="Urgent" />;
            case 'SUCCESS':
                return <StatusBadge status="success" label="Confirmed" />;
            default:
                return <StatusBadge status="info" label="Standard" />;
        }
    };

    const getAudienceLabel = (crit) => {
        switch (crit) {
            case 'ALL_USERS':
                return 'All Attendees';
            case 'ADMINS':
                return 'Admins Only';
            case 'VOLUNTEERS':
                return 'Staff & Volunteers';
            default:
                return crit || 'All Attendees';
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Standard SaaS Page Header */}
            <PageHeader
                title="Broadcast Announcements"
                subtitle="Dispatch updates, critical alerts, and reminders to event participants and staff."
                breadcrumbs={[
                    { label: 'Admin', to: '/admin' },
                    { label: 'Notifications' }
                ]}
                badge={
                    <span className="text-xs text-slate-400 font-medium">
                        Sent: <strong className="text-white">{notifications.length}</strong>
                    </span>
                }
                actions={
                    <button 
                        onClick={fetchNotifications}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                }
            />

            {/* Grid Layout: Compose Form & Announcement History */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Compose Form */}
                <div className="lg:col-span-7">
                    <div className="bg-[#111319] border border-white/[0.06] rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 pb-5 border-b border-white/[0.06]">
                            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                                <Send className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Compose Announcement</h3>
                                <p className="text-xs text-slate-400">Direct notifications to your selected audience.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSend} className="space-y-4 pt-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Target Audience</label>
                                    <select 
                                        value={formData.audience}
                                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                                        className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                    >
                                        <option value="ALL_USERS">All Registered Participants</option>
                                        <option value="ADMINS">Administrators Only</option>
                                        <option value="VOLUNTEERS">Volunteers & Coordinators</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Priority Level</label>
                                    <select 
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                    >
                                        <option value="NORMAL">Standard</option>
                                        <option value="URGENT">Urgent Alert</option>
                                        <option value="SUCCESS">Confirmation</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">Subject</label>
                                <input 
                                    type="text" 
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="e.g. Venue Opening Timings & Badge Collection"
                                    className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2.5 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">Message</label>
                                <textarea 
                                    rows="5"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="Write your announcement details here..."
                                    className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={sending}
                                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Dispatching Announcement...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Send Announcement</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: History Timeline */}
                <div className="lg:col-span-5">
                    <div className="bg-[#111319] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col shadow-sm">
                        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Bell className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Sent Announcements</h3>
                            </div>
                            <span className="text-xs text-slate-400">
                                {notifications.length} total
                            </span>
                        </div>

                        <div className="p-4 space-y-3 max-h-[580px] overflow-y-auto">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] animate-pulse space-y-2">
                                        <div className="h-4 bg-white/10 rounded w-2/3" />
                                        <div className="h-3 bg-white/5 rounded w-full" />
                                        <div className="h-3 bg-white/5 rounded w-4/5" />
                                    </div>
                                ))
                            ) : notifications.length === 0 ? (
                                <div className="py-12">
                                    <EmptyState 
                                        icon={Bell}
                                        title="No announcements yet"
                                        description="Sent announcements will appear here with recipient criteria and dispatch timestamps."
                                    />
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div 
                                        key={notif.id}
                                        className="p-4 rounded-xl bg-[#0d0f14] border border-white/[0.06] hover:border-white/10 transition-colors space-y-2.5"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {getPriorityBadge(notif.priority)}
                                                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                                                    {getAudienceLabel(notif.recipients_criteria)}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                                                {notif.created_at ? new Date(notif.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : 'Recent'}
                                            </span>
                                        </div>

                                        <h4 className="text-xs font-bold text-white tracking-tight">
                                            {notif.subject}
                                        </h4>

                                        <p className="text-xs text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
                                            {notif.message}
                                        </p>
                                    </div>
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
