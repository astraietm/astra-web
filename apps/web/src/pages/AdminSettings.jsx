import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Settings, Save, Lock, Globe, Bell, Server, Database, Moon, Sun, Users, Mail, Trash2 } from 'lucide-react';

const Toggle = ({ enabled, onChange }) => (
    <button 
        onClick={() => onChange(!enabled)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${enabled ? 'bg-primary' : 'bg-gray-700'}`}
    >
        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
);

const SettingSection = ({ icon: Icon, title, children }) => (
    <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3 pb-4 border-b border-white/5">
            <Icon className="text-gray-400" size={20} />
            {title}
        </h3>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);

const SettingItem = ({ label, description, rightElement }) => (
    <div className="flex justify-between items-center">
        <div>
            <h4 className="text-sm font-medium text-white">{label}</h4>
            <p className="text-xs text-gray-500 mt-0.5 max-w-sm">{description}</p>
        </div>
        <div>
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
            // Merge remote settings with defaults
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
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <Settings className="text-primary w-6 h-6" />
                        System Settings
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Configure global application parameters</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <SettingSection icon={Globe} title="General Configuration">
                <SettingItem 
                    label="Public Registration" 
                    description="Allow new users to sign up for accounts and events publicly."
                    rightElement={
                        <Toggle 
                            enabled={settings.registrationOpen} 
                            onChange={(val) => updateSetting('registrationOpen', val)} 
                        />
                    }
                />
                <SettingItem 
                    label="Maintenance Mode" 
                    description="Disable public access to the site. Only admins can log in."
                    rightElement={
                        <Toggle 
                            enabled={settings.maintenanceMode} 
                            onChange={(val) => updateSetting('maintenanceMode', val)} 
                        />
                    }
                />
            </SettingSection>

            <SettingSection icon={Bell} title="Notifications & Alerts">
                <SettingItem 
                    label="Email System" 
                    description="Enable automated email dispatch for registrations and password resets."
                    rightElement={
                        <Toggle 
                            enabled={settings.emailNotifications} 
                            onChange={(val) => updateSetting('emailNotifications', val)} 
                        />
                    }
                />
                 <SettingItem 
                    label="Slack Webhooks" 
                    description="Send critical system alerts to the dedicated Slack channel."
                    rightElement={
                        <button className="text-xs text-primary font-bold hover:underline">Configure Webhooks</button>
                    }
                />
            </SettingSection>

            <SettingSection icon={Lock} title="Security & Access">
                <SettingItem 
                    label="Two-Factor Authentication (2FA)" 
                    description="Enforce 2FA for all administrator accounts."
                    rightElement={
                        <Toggle 
                            enabled={settings.twoFactor} 
                            onChange={(val) => updateSetting('twoFactor', val)} 
                        />
                    }
                />
                <SettingItem 
                    label="Session Timeout" 
                    description="Automatically log out inactive users after a set period."
                    rightElement={
                        <select className="bg-[#0B0F14] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none">
                            <option>15 Minutes</option>
                            <option>30 Minutes</option>
                            <option>1 Hour</option>
                            <option>4 Hours</option>
                        </select>
                    }
                />
            </SettingSection>



            {/* MANAGE TEAM SECTION */}
            <SettingSection icon={Users} title="Manage Team Access">
                 <div className="space-y-4">
                    {/* Add New Member */}
                    <div className="flex gap-2 items-end bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs text-gray-400">New Member Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                                <input 
                                    type="email" 
                                    placeholder="student@college.edu" 
                                    value={newMemberEmail}
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    className="w-full bg-[#0B0F14] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>
                        <div className="w-32 space-y-1">
                             <label className="text-xs text-gray-400">Role</label>
                             <select 
                                value={newMemberRole}
                                onChange={(e) => setNewMemberRole(e.target.value)}
                                className="w-full bg-[#0B0F14] border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary"
                             >
                                 <option value="VOLUNTEER">Volunteer</option>
                                 <option value="ADMIN">Admin</option>
                             </select>
                        </div>
                        <button 
                            onClick={handleAddMember}
                            disabled={!newMemberEmail}
                            className="h-[38px] px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                            Add
                        </button>
                    </div>

                    {/* Team List */}
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-400 pl-1">Authorized Members</h4>
                        {teamMembers.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 text-sm italic">No team members added yet.</div>
                        ) : (
                            teamMembers.map((member) => (
                                <div key={member.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${member.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {member.role[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm text-white">{member.email}</p>
                                            <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                                Added: {new Date(member.added_at).toLocaleDateString()}
                                                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                <span className={member.role === 'ADMIN' ? 'text-purple-400' : 'text-emerald-400'}>{member.role}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteMember(member.id)}
                                        className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Remove Access"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                 </div>
            </SettingSection>

            <SettingSection icon={Server} title="Database & Storage">
                 <SettingItem 
                    label="Clear Cache" 
                    description="Purge valid cache entries to force data refresh."
                    rightElement={
                        <button className="px-3 py-1.5 border border-white/10 hover:bg-white/5 rounded-lg text-xs text-white transition-colors">Purge Now</button>
                    }
                />
            </SettingSection>
        </div>
    );
};

export default AdminSettings;
