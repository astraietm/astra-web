import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings, 
    Save, 
    Lock, 
    Globe, 
    Bell, 
    Server, 
    Database, 
    Users, 
    Mail, 
    Trash2, 
    Shield, 
    Activity
} from 'lucide-react';

const Toggle = ({ enabled, onChange }) => (
    <button 
        onClick={() => onChange(!enabled)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 relative ${enabled ? 'bg-blue-600' : 'bg-white/[0.1] border border-white/10'}`}
    >
        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-all duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

const SettingSection = ({ icon: Icon, title, sub, children }) => (
    <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-blue-500">
                <Icon size={20} />
            </div>
            <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="text-xs font-medium text-slate-500">{sub}</p>
            </div>
        </div>

        <div className="space-y-8">
            {children}
        </div>
    </div>
);

const SettingItem = ({ label, description, rightElement }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1 pr-6 flex-1">
            <h4 className="text-sm font-bold text-slate-200">{label}</h4>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg">{description}</p>
        </div>
        <div className="shrink-0">
            {rightElement}
        </div>
    </div>
);

const AdminSettings = () => {
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

    const [settings, setSettings] = useState({
        registrationOpen: true,
        maintenanceMode: false,
        emailNotifications: true,
        publicProfile: true,
        twoFactor: true,
        darkMode: true
    });
    
    // Team Management State
    const [teamMembers, setTeamMembers] = useState([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('VOLUNTEER');
    
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
        fetchTeam();
    }, [token]);

    const fetchTeam = async () => {
        try {
            const response = await axios.get(`${API_URL}/ops/team/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch team", error);
        }
    };

    const handleAddMember = async () => {
        try {
            await axios.post(`${API_URL}/ops/team/`, {
                email: newMemberEmail,
                role: newMemberRole
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMemberEmail('');
            fetchTeam(); // Refresh list
            alert('Team member added!');
        } catch (error) {
            console.error("Failed to add member", error);
            alert('Failed to add member.');
        }
    };

    const handleDeleteMember = async (id) => {
        if(!confirm('Are you sure you want to remove this member?')) return;
        try {
            await axios.delete(`${API_URL}/ops/team/${id}/`, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            fetchTeam();
        } catch (error) {
           console.error("Failed to remove member", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/ops/settings/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setSettings(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post(`${API_URL}/ops/settings/`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Failed to save settings", error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Configuration</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider relative z-10">Settings</h1>
                        <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">
                            Manage global system preferences, security, and access controls.
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="relative group overflow-hidden"
                    >
                        <div className="relative h-12 px-8 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg items-center justify-center">
                            <Save size={16} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* General Config */}
                <SettingSection icon={Globe} title="General Settings" sub="Public visibility and access">
                    <SettingItem 
                        label="Public Registration" 
                        description="Allow new users to register for events publicly."
                        rightElement={
                            <Toggle 
                                enabled={settings.registrationOpen} 
                                onChange={(val) => updateSetting('registrationOpen', val)} 
                            />
                        }
                    />
                    <div className="h-px w-full bg-white/[0.05]" />
                    <SettingItem 
                        label="Maintenance Mode" 
                        description="Disable public access to the platform. Admin access only."
                        rightElement={
                            <Toggle 
                                enabled={settings.maintenanceMode} 
                                onChange={(val) => updateSetting('maintenanceMode', val)} 
                            />
                        }
                    />
                </SettingSection>

                {/* Notifications */}
                <SettingSection icon={Bell} title="Notifications" sub="Email and system alerts">
                    <SettingItem 
                        label="Email Notifications" 
                        description="Enable automated emails for registrations and password resets."
                        rightElement={
                            <Toggle 
                                enabled={settings.emailNotifications} 
                                onChange={(val) => updateSetting('emailNotifications', val)} 
                            />
                        }
                    />
                    <div className="h-px w-full bg-white/[0.05]" />
                     <SettingItem 
                        label="Slack Integration" 
                        description="Connect webhook for real-time team notifications."
                        rightElement={
                            <button className="text-xs font-bold text-blue-500 hover:text-white transition-colors">Configure</button>
                        }
                    />
                </SettingSection>

                {/* Security */}
                <SettingSection icon={Lock} title="Security" sub="Authentication and session control">
                    <SettingItem 
                        label="Two-Factor Authentication" 
                        description="Require 2FA for all administrative accounts."
                        rightElement={
                            <Toggle 
                                enabled={settings.twoFactor} 
                                onChange={(val) => updateSetting('twoFactor', val)} 
                            />
                        }
                    />
                    <div className="h-px w-full bg-white/[0.05]" />
                    <SettingItem 
                        label="Session Timeout" 
                        description="Automatically log out inactive users."
                        rightElement={
                            <select className="bg-black/40 border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-blue-500/50">
                                <option>15 Minutes</option>
                                <option>30 Minutes</option>
                                <option>1 Hour</option>
                                <option>4 Hours</option>
                            </select>
                        }
                    />
                </SettingSection>

                {/* Database */}
                <SettingSection icon={Server} title="System" sub="Cache and data management">
                    <SettingItem 
                        label="Clear Cache" 
                        description="Purge application cache to force fresh data reload."
                        rightElement={
                            <button className="px-4 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-all">Clear Now</button>
                        }
                    />
                    <div className="h-px w-full bg-white/[0.05]" />
                    <SettingItem 
                        label="Database Latency" 
                        description="Current response time from primary node."
                        rightElement={
                            <div className="flex items-center gap-2">
                                <Activity size={14} className="text-emerald-500" />
                                <span className="text-xs font-bold text-emerald-500">12ms</span>
                            </div>
                        }
                    />
                </SettingSection>

                {/* Team Access */}
                <div className="xl:col-span-2">
                    <SettingSection icon={Users} title="Team Management" sub="Manage admin and volunteer access">
                        <div className="space-y-8">
                            {/* Add New Personnel */}
                            <div className="flex flex-col md:flex-row gap-4 items-end bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05]">
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input 
                                            type="email" 
                                            placeholder="user@example.com" 
                                            value={newMemberEmail}
                                            onChange={(e) => setNewMemberEmail(e.target.value)}
                                            className="w-full bg-black/40 border border-white/[0.1] rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-48 space-y-2">
                                     <label className="text-xs font-bold text-slate-500 ml-1">Role</label>
                                     <select 
                                        value={newMemberRole}
                                        onChange={(e) => setNewMemberRole(e.target.value)}
                                        className="w-full bg-black/40 border border-white/[0.1] rounded-xl py-3 px-4 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
                                     >
                                         <option value="VOLUNTEER">Volunteer</option>
                                         <option value="ADMIN">Admin</option>
                                     </select>
                                </div>
                                <button 
                                    onClick={handleAddMember}
                                    disabled={!newMemberEmail}
                                    className="h-11 px-6 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Member
                                </button>
                            </div>

                            {/* Personnel List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {teamMembers.length === 0 ? (
                                    <div className="col-span-full py-12 flex flex-col items-center gap-3 opacity-40 border border-dashed border-white/10 rounded-2xl">
                                        <Users size={32} />
                                        <span className="text-xs font-medium uppercase tracking-wider">No team members found</span>
                                    </div>
                                ) : (
                                    teamMembers.map((member) => (
                                        <div 
                                            key={member.id} 
                                            className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/[0.05] hover:border-white/[0.1] transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shadow-inner ${member.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                    {member.role[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold text-white truncate max-w-[150px] md:max-w-xs">{member.email}</p>
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-fit mt-1 ${member.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                        {member.role}
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteMember(member.id)}
                                                className="p-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                                title="Remove Member"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </SettingSection>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
