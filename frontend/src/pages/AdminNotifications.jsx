import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Bell, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const NotificationItem = ({ type, title, message, time, recipients }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg 
                    ${type === 'urgent' ? 'bg-rose-500/20 text-rose-400' : 
                      type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                      'bg-primary/20 text-primary'}`}>
                    {type === 'urgent' ? <AlertTriangle size={18} /> : 
                     type === 'success' ? <CheckCircle size={18} /> : 
                     <Bell size={18} />}
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">{title}</h4>
                    <span className="text-xs text-gray-500">{recipients} recipients</span>
                </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                {time}
            </div>
        </div>
        <p className="text-gray-400 text-xs pl-[52px]">{message}</p>
    </div>
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
            
            // Refund form
            setFormData({ ...formData, subject: '', message: '' });
            fetchNotifications(); // Refresh list
            alert('Notification dispatched successfully!');
        } catch (error) {
            console.error("Failed to send notification", error);
            alert('Failed to dispatch notification.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <Mail className="text-primary w-6 h-6" />
                        Notification Dispatcher
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Broadcast messages to system users</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Compose */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-vision-card backdrop-blur-2xl border border-white/5 p-6 rounded-[20px]">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Send size={18} className="text-primary" />
                            Compose Blast
                        </h2>
                        
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Target Audience</label>
                                    <select 
                                        value={formData.audience}
                                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                                        className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                    >
                                        <option>All Registered Users</option>
                                        <option>Admins Only</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Priority Level</label>
                                    <select 
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                        className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                    >
                                        <option value="NORMAL">Normal Info</option>
                                        <option value="URGENT">Urgent Alert</option>
                                        <option value="SUCCESS">Success Update</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Subject Line</label>
                                <input 
                                    type="text" 
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="e.g., Update regarding Hackathon Schedule"
                                    className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Message Content</label>
                                <textarea 
                                    rows="8"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="Type your message here..."
                                    className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none"
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={sending}
                                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Send size={18} />
                                    {sending ? 'Dispatching...' : 'Dispatch Notification'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: History */}
                <div className="space-y-6">
                    <div className="bg-vision-card backdrop-blur-2xl border border-white/5 p-6 rounded-[20px] h-full flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-6">Recent Dispatches</h3>
                        <div className="space-y-3 overflow-y-auto flex-1 h-0 min-h-[400px]">
                            {loading ? <p className="text-gray-500 text-sm">Loading history...</p> : 
                             notifications.length === 0 ? <p className="text-gray-500 text-sm">No notifications sent yet.</p> :
                             notifications.map((notif) => (
                                <NotificationItem 
                                    key={notif.id}
                                    type={notif.priority === 'URGENT' ? 'urgent' : notif.priority === 'SUCCESS' ? 'success' : 'normal'}
                                    title={notif.subject}
                                    message={notif.message}
                                    time={new Date(notif.created_at).toLocaleDateString()}
                                    recipients={notif.recipients_criteria}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
