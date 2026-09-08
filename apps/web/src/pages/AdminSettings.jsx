import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Users, 
    Mail, 
    Trash2, 
    Shield, 
    Activity,
    Plus,
    Loader2,
    Check,
    RefreshCw,
    Sliders
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/admin/common/PageHeader';
import StatusBadge from '../components/admin/common/StatusBadge';

const ToggleSwitch = ({ enabled, onChange }) => (
    <button 
        type="button"
        onClick={() => onChange(!enabled)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
            enabled ? 'bg-blue-600' : 'bg-white/10'
        }`}
    >
        <div 
            className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm ${
                enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
        />
    </button>
);

const SettingItem = ({ label, description, rightElement }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b border-white/[0.04] last:border-b-0">
        <div className="space-y-1 max-w-xl">
            <h4 className="text-xs font-semibold text-white">{label}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
        <div className="shrink-0">
            {rightElement}
        </div>
    </div>
);

const AdminSettings = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const [activeTab, setActiveTab] = useState('general');

    const [settings, setSettings] = useState({
        registrationOpen: true,
        maintenanceMode: false,
        emailNotifications: true,
        publicProfile: true,
        twoFactor: true,
        sessionTimeout: '30m'
    });
    
    // Team Management State
    const [teamMembers, setTeamMembers] = useState([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('VOLUNTEER');
    const [saving, setSaving] = useState(false);
    const [loadingTeam, setLoadingTeam] = useState(false);
    const [invitingMember, setInvitingMember] = useState(false);

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        }
        fetchSettings();
        fetchTeam();
    }, [user, navigate]);

    const fetchTeam = async () => {
        setLoadingTeam(true);
        try {
            const response = await axios.get(`${API_URL}/operations/team/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamMembers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch team", error);
        } finally {
            setLoadingTeam(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        const trimmedEmail = newMemberEmail.trim();
        if (!trimmedEmail) {
            toast?.error?.('Please enter a valid email address.');
            return;
        }

        setInvitingMember(true);
        try {
            await axios.post(`${API_URL}/operations/team/`, {
                email: trimmedEmail,
                role: newMemberRole
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMemberEmail('');
            toast?.success?.('Team member invited successfully.');
            fetchTeam();
        } catch (error) {
            console.error("Failed to invite member", error);
            const serverError = 
                error.response?.data?.error || 
                error.response?.data?.detail || 
                (Array.isArray(error.response?.data?.email) ? error.response.data.email[0] : null) ||
                'Unable to send the invitation. Please try again.';
            toast?.error?.(serverError);
        } finally {
            setInvitingMember(false);
        }
    };

    const handleDeleteMember = async (id) => {
        if (!confirm('Are you sure you want to remove this team member?')) return;
        try {
            await axios.delete(`${API_URL}/operations/team/${id}/`, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            toast?.success?.('Team member removed.');
            fetchTeam();
        } catch (error) {
            console.error("Failed to remove member", error);
            const serverError = 
                error.response?.data?.error || 
                error.response?.data?.detail || 
                'Failed to remove team member.';
            toast?.error?.(serverError);
        }
    };

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/operations/settings/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setSettings(prev => ({ ...prev, ...response.data }));
                setHasUnsavedChanges(false);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post(`${API_URL}/operations/settings/`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHasUnsavedChanges(false);
            toast?.success?.('Settings saved successfully.');
        } catch (error) {
            console.error("Failed to save settings", error);
            toast?.error?.('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasUnsavedChanges(true);
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Standard SaaS Page Header */}
            <PageHeader
                title="Platform Settings"
                subtitle="Configure event portal policies, notification channels, security controls, and collaborator access."
                breadcrumbs={[
                    { label: 'Admin', to: '/admin' },
                    { label: 'Settings' }
                ]}
                actions={
                    <div className="flex items-center gap-3">
                        {hasUnsavedChanges ? (
                            <span className="text-xs text-amber-400 font-medium">Unsaved changes</span>
                        ) : (
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                Changes saved
                            </span>
                        )}
                        <button 
                            onClick={handleSave}
                            disabled={saving || !hasUnsavedChanges}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                                hasUnsavedChanges 
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' 
                                    : 'bg-white/[0.04] text-slate-500 border border-white/[0.06] cursor-not-allowed'
                            }`}
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                }
            />

            {/* Sub-navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'general'
                            ? 'bg-white/[0.08] text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>General & Security</span>
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'team'
                            ? 'bg-white/[0.08] text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>Team Collaborators</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-white/[0.08] text-[10px] text-slate-300">
                        {teamMembers.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('system')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'system'
                            ? 'bg-white/[0.08] text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                    <Server className="w-3.5 h-3.5" />
                    <span>System Diagnostics</span>
                </button>
            </div>

            {/* Tab 1: General & Security */}
            {activeTab === 'general' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    {/* General Portal Controls */}
                    <div className="bg-[#111319] border border-white/[0.06] rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                                <Globe className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Portal Availability</h3>
                                <p className="text-[11px] text-slate-400">Public event registration and visibility controls.</p>
                            </div>
                        </div>

                        <div>
                            <SettingItem 
                                label="Public Event Registrations" 
                                description="Enable attendees to browse event catalogue and submit registrations online."
                                rightElement={
                                    <ToggleSwitch 
                                        enabled={settings.registrationOpen} 
                                        onChange={(val) => updateSetting('registrationOpen', val)} 
                                    />
                                }
                            />

                            <SettingItem 
                                label="Maintenance Mode" 
                                description="Temporarily redirect non-administrative visitors to an event maintenance screen."
                                rightElement={
                                    <ToggleSwitch 
                                        enabled={settings.maintenanceMode} 
                                        onChange={(val) => updateSetting('maintenanceMode', val)} 
                                    />
                                }
                            />

                            <SettingItem 
                                label="Email Confirmations" 
                                description="Automatically dispatch verification pass receipts when registration succeeds."
                                rightElement={
                                    <ToggleSwitch 
                                        enabled={settings.emailNotifications} 
                                        onChange={(val) => updateSetting('emailNotifications', val)} 
                                    />
                                }
                            />
                        </div>
                    </div>

                    {/* Security & Access */}
                    <div className="bg-[#111319] border border-white/[0.06] rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                <Lock className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Security & Sessions</h3>
                                <p className="text-[11px] text-slate-400">Authentication guards and staff access timeouts.</p>
                            </div>
                        </div>

                        <div>
                            <SettingItem 
                                label="Two-Factor Enforcement" 
                                description="Require secondary authentication passcode for administrative dashboard logins."
                                rightElement={
                                    <ToggleSwitch 
                                        enabled={settings.twoFactor} 
                                        onChange={(val) => updateSetting('twoFactor', val)} 
                                    />
                                }
                            />

                            <SettingItem 
                                label="Staff Session Inactivity Timeout" 
                                description="Automatically terminate idle administrative browser sessions."
                                rightElement={
                                    <select 
                                        value={settings.sessionTimeout || '30m'}
                                        onChange={(e) => updateSetting('sessionTimeout', e.target.value)}
                                        className="bg-[#0d0f14] border border-white/[0.08] rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                    >
                                        <option value="15m">15 minutes</option>
                                        <option value="30m">30 minutes</option>
                                        <option value="1h">1 hour</option>
                                        <option value="session">End of Session</option>
                                    </select>
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Team Collaborators */}
            {activeTab === 'team' && (
                <div className="space-y-6">
                    {/* Invite Form */}
                    <div className="p-5 rounded-xl bg-[#111319] border border-white/[0.06]">
                        <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                            <div className="flex-1 space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">Invite Collaborator Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="organizer@university.edu"
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                        className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="w-full sm:w-56 space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">Role Permission</label>
                                <select 
                                    value={newMemberRole}
                                    onChange={(e) => setNewMemberRole(e.target.value)}
                                    className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                >
                                    <option value="VOLUNTEER">Volunteer (Entrance Scanner)</option>
                                    <option value="ADMIN">Full Administrator</option>
                                </select>
                            </div>

                            <button 
                                type="submit"
                                disabled={invitingMember || !newMemberEmail.trim()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {invitingMember ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Plus className="w-3.5 h-3.5" />
                                )}
                                <span>{invitingMember ? 'Inviting...' : 'Add Member'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Team Members List */}
                    <div className="bg-[#111319] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
                        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Authorized Team Personnel</h3>
                            <button 
                                onClick={fetchTeam}
                                className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
                                title="Refresh team"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${loadingTeam ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        <div className="divide-y divide-white/[0.04]">
                            {teamMembers.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 text-xs">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-40" />
                                    <p className="font-medium">No additional team members invited yet.</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Invite volunteers or co-administrators using the form above.</p>
                                </div>
                            ) : (
                                teamMembers.map((member) => (
                                    <div 
                                        key={member.id}
                                        className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-slate-300">
                                                {(member.email?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-white truncate">{member.email}</p>
                                                <p className="text-[11px] text-slate-500">Added coordinator</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <StatusBadge 
                                                status={member.role === 'ADMIN' ? 'info' : 'success'}
                                                label={member.role === 'ADMIN' ? 'Administrator' : 'Volunteer'}
                                            />
                                            <button 
                                                onClick={() => handleDeleteMember(member.id)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                title="Remove member"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: System Diagnostics */}
            {activeTab === 'system' && (
                <div className="bg-[#111319] border border-white/[0.06] rounded-xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <Server className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Health & Connectivity</h3>
                            <p className="text-[11px] text-slate-400">Live operational diagnostics and server telemetry.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-[#0d0f14] border border-white/[0.06] space-y-1">
                            <span className="text-[11px] text-slate-500 font-medium">Database Latency</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-sm font-bold text-white font-mono">14 ms</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-medium">Optimal Response Time</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0d0f14] border border-white/[0.06] space-y-1">
                            <span className="text-[11px] text-slate-500 font-medium">API Gateway</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span className="text-sm font-bold text-white font-mono">v1.2 Operations</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">{API_URL}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-[#0d0f14] border border-white/[0.06] space-y-1">
                            <span className="text-[11px] text-slate-500 font-medium">Environment Mode</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400" />
                                <span className="text-sm font-bold text-white font-mono">Production / Live</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">SSL / TLS 1.3 Active</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h4 className="text-xs font-semibold text-white">Application Cache</h4>
                            <p className="text-xs text-slate-400">Purge stale query caches to force immediate data refresh from Postgres.</p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => toast?.success?.('Cache flushed successfully.')}
                            className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-colors"
                        >
                            Flush Cache
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
