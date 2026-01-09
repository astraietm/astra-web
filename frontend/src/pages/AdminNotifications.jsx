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
    const [activeTab, setActiveTab] = useState('compose');

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
                        
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Target Audience</label>
                                    <select className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors">
                                        <option>All Registered Users</option>
                                        <option>Event Attendees Only</option>
                                        <option>Admins Only</option>
                                        <option>Specific Email List</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase">Priority Level</label>
                                    <select className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors">
                                        <option>Normal Info</option>
                                        <option>Urgent Alert</option>
                                        <option>Success Update</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Subject Line</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Update regarding Hackathon Schedule"
                                    className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Message Content</label>
                                <textarea 
                                    rows="8"
                                    placeholder="Type your message here..."
                                    className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="button" className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                                    <Send size={18} />
                                    Dispatch Notification
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Column: History */}
                <div className="space-y-6">
                    <div className="bg-vision-card backdrop-blur-2xl border border-white/5 p-6 rounded-[20px] h-full">
                        <h3 className="text-lg font-bold text-white mb-6">Recent Dispatches</h3>
                        <div className="space-y-3">
                            <NotificationItem 
                                type="normal"
                                title="Registration Reminder"
                                message="Don't forget to check in for the Cyber Defense event tomorrow morning."
                                time="2h ago"
                                recipients={1250}
                            />
                            <NotificationItem 
                                type="urgent"
                                title="Server Maintenance"
                                message="System will be down for 30 mins tonight for critical updates."
                                time="5h ago"
                                recipients={3400}
                            />
                            <NotificationItem 
                                type="success"
                                title="Hackathon Winners"
                                message="Congratulations to Team NullPointer for winning the 2024 Bash!"
                                time="1d ago"
                                recipients={2800}
                            />
                            <NotificationItem 
                                type="normal"
                                title="Welcome New Members"
                                message="Weekly welcome digest sent to all new signups."
                                time="2d ago"
                                recipients={45}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
