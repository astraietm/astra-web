"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Settings as SettingsIcon, Save, Loader2, UserPlus, Trash2, Users, BookOpen, Plus, X } from "lucide-react";

const INPUT_CLS = "w-full px-3 py-2 bg-[#0C0C14] border-2 border-white/20 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FFE816] transition-colors";

function BrutalToggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-12 h-6 border-2 transition-colors ${value ? "bg-[#C3FF16] border-[#C3FF16]" : "bg-[#0C0C14] border-white/30"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 border-2 transition-all ${value ? "left-[calc(100%-1.125rem)] bg-black border-black" : "left-0.5 bg-white/50 border-white/30"}`} />
    </button>
  );
}

const DEFAULT_DEPTS = ["CSE", "CY", "EC", "EEE", "ME", "CE", "AD", "MCA", "BSH", "Other"];
const DEFAULT_SEMS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "PG", "Faculty", "Other"];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [departments, setDepartments] = useState<string[]>(DEFAULT_DEPTS);
  const [semesters, setSemesters] = useState<string[]>(DEFAULT_SEMS);
  const [newDept, setNewDept] = useState("");
  const [newSem, setNewSem] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [team, setTeam] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, teamRes] = await Promise.all([
          api.get("/api/ops/settings/"),
          api.get("/api/ops/team/"),
        ]);
        const settingsMap: Record<string, any> = {};
        if (Array.isArray(settingsRes.data)) {
          settingsRes.data.forEach((s: any) => { settingsMap[s.key] = s.value; });
        } else {
          Object.assign(settingsMap, settingsRes.data);
        }
        setSettings(settingsMap);
        if (Array.isArray(settingsMap.departments) && settingsMap.departments.length > 0) {
          setDepartments(settingsMap.departments);
        }
        if (Array.isArray(settingsMap.semesters) && settingsMap.semesters.length > 0) {
          setSemesters(settingsMap.semesters);
        }
        setTeam(Array.isArray(teamRes.data) ? teamRes.data : teamRes.data?.results || []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const payload = {
        ...settings,
        departments,
        semesters,
      };
      for (const [key, value] of Object.entries(payload)) {
        await api.post("/api/ops/settings/", { key, value, description: key });
      }
      showToast("Settings and Academic Options saved!", "success");
    } catch { showToast("Failed to save settings.", "error"); }
    finally { setSaving(false); }
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newDept.trim().toUpperCase();
    if (!formatted) return;
    if (departments.includes(formatted)) {
      showToast("Department already exists.", "warning");
      return;
    }
    setDepartments([...departments, formatted]);
    setNewDept("");
  };

  const handleRemoveDepartment = (deptToRemove: string) => {
    setDepartments(departments.filter(d => d !== deptToRemove));
  };

  const handleAddSemester = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newSem.trim().toUpperCase();
    if (!formatted) return;
    if (semesters.includes(formatted)) {
      showToast("Semester already exists.", "warning");
      return;
    }
    setSemesters([...semesters, formatted]);
    setNewSem("");
  };

  const handleRemoveSemester = (semToRemove: string) => {
    setSemesters(semesters.filter(s => s !== semToRemove));
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) { showToast("Email is required.", "error"); return; }
    setAddingMember(true);
    try {
      await api.post("/api/ops/team/", { email: newEmail });
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-[#FFE816]" />
      <span className="font-pixel text-[10px] text-white/30 uppercase animate-pulse">Loading...</span>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 bg-[#FFE816] border-2 border-black">
          <SettingsIcon className="w-4 h-4 text-black" />
        </div>
        <div>
          <h1 className="font-pixel text-xl font-bold text-white uppercase">Settings</h1>
          <p className="font-mono text-[10px] text-white/30 uppercase">System Configuration & Academic Options</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings & Academic Options */}
        <div className="space-y-6">
          <div className="border-2 border-white/20 bg-[#161622] p-5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-white/10">
              <SettingsIcon className="w-4 h-4 text-[#FFE816]" />
              <span className="font-pixel text-[10px] text-white uppercase tracking-wider">System Settings</span>
            </div>
            <div className="space-y-4">
              {[
                { key: "maintenanceMode", label: "Maintenance Mode", desc: "Disable public access to the site" },
                { key: "registrationOpen",  label: "Registration Open",  desc: "Allow new event registrations" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between border-2 border-white/10 p-3 hover:border-white/20 transition-colors">
                  <div>
                    <p className="font-pixel text-[10px] text-white uppercase">{label}</p>
                    <p className="font-mono text-[9px] text-white/30 mt-0.5">{desc}</p>
                  </div>
                  <BrutalToggle
                    value={!!settings[key]}
                    onChange={() => setSettings({ ...settings, [key]: !settings[key] })}
                  />
                </div>
              ))}
            </div>
          </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Options Management (Depts & Semesters) */}
          <div className="border-2 border-white/20 bg-[#161622] shadow-[4px_4px_0px_rgba(255,255,255,0.06)] p-5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-white/10">
              <BookOpen className="w-4 h-4 text-[#C3FF16]" />
              <span className="font-pixel text-[10px] text-white uppercase tracking-wider">Academic Options (Registration Dropdowns)</span>
            </div>

            {/* Department Options */}
            <div className="mb-6">
              <label className="font-pixel text-[9px] text-white/70 uppercase mb-2 block">Departments</label>
              <form onSubmit={handleAddDepartment} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. CSE, CY, EC, AI"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className={INPUT_CLS + " flex-1 text-xs"}
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-2 bg-[#C3FF16] text-black font-pixel text-[9px] border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5 p-3 border-2 border-white/10 bg-black/30 min-h-[60px]">
                {departments.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1 font-mono text-xs px-2 py-1 bg-white/10 border border-white/20 text-white"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => handleRemoveDepartment(d)}
                      className="text-white/40 hover:text-red-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Semester Options */}
            <div className="mb-4">
              <label className="font-pixel text-[9px] text-white/70 uppercase mb-2 block">Semesters / Years</label>
              <form onSubmit={handleAddSemester} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. S1, S2, S3... S8"
                  value={newSem}
                  onChange={(e) => setNewSem(e.target.value)}
                  className={INPUT_CLS + " flex-1 text-xs"}
                />
                <button
                  type="submit"
                  className="flex items-center gap-1 px-3 py-2 bg-[#FFE816] text-black font-pixel text-[9px] border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
              <div className="flex flex-wrap gap-1.5 p-3 border-2 border-white/10 bg-black/30 min-h-[60px]">
                {semesters.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 font-mono text-xs px-2 py-1 bg-white/10 border border-white/20 text-white"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSemester(s)}
                      className="text-white/40 hover:text-red-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-[#FFE816] text-black font-pixel text-[10px] uppercase border-2 border-black hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Settings &amp; Academic Options
            </button>
          </div>
        </div>

        {/* Team Management */}
        <div className="border-2 border-white/20 bg-[#161622] p-5">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-white/10">
            <Users className="w-4 h-4 text-[#FFE816]" />
            <span className="font-pixel text-[10px] text-white uppercase tracking-wider">Team Management</span>
          </div>

          {/* Add member form */}
          <form onSubmit={handleAddTeamMember} className="flex gap-2 mb-5">
            <input
              type="email" placeholder="team@email.com" value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)} required
              className={INPUT_CLS + " flex-1 text-xs"}
            />
            <button
              type="submit" disabled={addingMember}
              className="flex items-center gap-1 px-3 py-2 bg-[#FFE816] text-black font-pixel text-[9px] border-2 border-black hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {addingMember ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Members list */}
          <div className="space-y-2 max-h-[320px] overflow-y-auto">
            {team.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center justify-between border-2 border-white/10 p-3 hover:border-white/20 transition-colors"
              >
                <div>
                  <p className="font-mono text-xs text-white">{member.email}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    {member.is_superuser && (
                      <span className="font-pixel text-[8px] uppercase px-1.5 py-0.5 border bg-[#FF4444] text-white border-red-700">
                        SUPERUSER
                      </span>
                    )}
                    {member.is_staff && (
                      <span className="font-pixel text-[8px] uppercase px-1.5 py-0.5 border bg-[#FFE816] text-black border-black">
                        STAFF
                      </span>
                    )}
                    {!member.is_superuser && Array.isArray(member.groups) && member.groups.includes("Admin") && (
                      <span className="font-pixel text-[8px] uppercase px-1.5 py-0.5 border bg-[#C3FF16] text-black border-black">
                        ADMIN GROUP
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id, member.email)}
                  disabled={member.is_superuser}
                  className="flex items-center justify-center w-7 h-7 border-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {team.length === 0 && (
              <div className="border-2 border-white/10 p-8 text-center">
                <p className="font-pixel text-[10px] text-white/20 uppercase">No team members.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
