"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Settings as SettingsIcon, Save, Loader2, UserPlus, Trash2, Users } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [team, setTeam] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("VOLUNTEER");
  const [addingMember, setAddingMember] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, teamRes] = await Promise.all([
          api.get("/api/ops/settings/"),
          api.get("/api/ops/team/"),
        ]);
        // Settings come as array, convert to map
        const settingsMap: Record<string, any> = {};
        if (Array.isArray(settingsRes.data)) {
          settingsRes.data.forEach((s: any) => { settingsMap[s.key] = s.value; });
        } else {
          Object.assign(settingsMap, settingsRes.data);
        }
        setSettings(settingsMap);
        setTeam(Array.isArray(teamRes.data) ? teamRes.data : teamRes.data?.results || []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await api.post("/api/ops/settings/", { key, value, description: key });
      }
      showToast("Settings saved!", "success");
    } catch { showToast("Failed to save settings.", "error"); }
    finally { setSaving(false); }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) { showToast("Email is required.", "error"); return; }
    setAddingMember(true);
    try {
      await api.post("/api/ops/team/", { email: newEmail, role: newRole });
      showToast("Team member added!", "success");
      setNewEmail("");
      const res = await api.get("/api/ops/team/");
      setTeam(Array.isArray(res.data) ? res.data : res.data?.results || []);
    } catch (err: any) {
      showToast(err.response?.data?.error || err.response?.data?.email?.[0] || "Failed to add.", "error");
    } finally { setAddingMember(false); }
  };

  const handleRemoveMember = async (id: number, email: string) => {
    if (!confirm(`Remove ${email} from the team?`)) return;
    try {
      await api.delete(`/api/ops/team/${id}/`);
      showToast("Member removed.", "success");
      setTeam(team.filter((t: any) => t.id !== id));
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to remove.", "error");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-500" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-6">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <div className="bg-[#111318] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2"><SettingsIcon className="w-4 h-4" /> System Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Maintenance Mode</span>
              <button onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`w-10 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ml-1 ${settings.maintenanceMode ? 'translate-x-4' : ''}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Registration Open</span>
              <button onClick={() => setSettings({...settings, registrationOpen: !settings.registrationOpen})}
                className={`w-10 h-6 rounded-full transition-colors ${settings.registrationOpen ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transform transition-transform ml-1 ${settings.registrationOpen ? 'translate-x-4' : ''}`} />
              </button>
            </div>
            <button onClick={handleSaveSettings} disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
            </button>
          </div>
        </div>

        {/* Team Management */}
        <div className="bg-[#111318] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Team Management</h2>
          <form onSubmit={handleAddTeamMember} className="flex gap-2 mb-4">
            <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required
              className="flex-1 px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white" />
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}
              className="px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white">
              <option value="VOLUNTEER">Volunteer</option><option value="ADMIN">Admin</option>
            </select>
            <button type="submit" disabled={addingMember}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {addingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            </button>
          </form>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {team.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02]">
                <div>
                  <p className="text-sm text-white">{member.email}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
                <button onClick={() => handleRemoveMember(member.id, member.email)} className="p-1 text-gray-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {team.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No team members.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
