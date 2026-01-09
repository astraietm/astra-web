import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Lock, Globe, Bell, Server, Database, Moon, Sun } from 'lucide-react';

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
    const [settings, setSettings] = useState({
        registrationOpen: true,
        maintenanceMode: false,
        emailNotifications: true,
        publicProfile: true,
        twoFactor: true,
        darkMode: true
    });

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
                <button className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                    <Save size={18} />
                    Save Changes
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
