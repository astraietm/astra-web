"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import {
  Settings as SettingsIcon,
  Save,
  Loader2,
  UserPlus,
  Trash2,
  Users,
  BookOpen,
  Plus,
  X,
  Shield,
} from "lucide-react";

function ModernToggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        value ? "bg-emerald-500" : "bg-neutral-800"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
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
          settingsRes.data.forEach((s: any) => {
            settingsMap[s.key] = s.value;
          });
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
      } catch {
      } finally {
        setLoading(false);
      }
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
      await api.post("/api/ops/settings/", payload);
      showToast("Settings and Academic Options saved successfully!", "success");
    } catch {
      showToast("Failed to save settings.", "error");
    } finally {
      setSaving(false);
    }
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
    setDepartments(departments.filter((d) => d !== deptToRemove));
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
    setSemesters(semesters.filter((s) => s !== semToRemove));
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      showToast("Email is required.", "error");
      return;
    }
    setAddingMember(true);
    try {
      await api.post("/api/ops/team/", { email: newEmail });
      showToast("Team member added!", "success");
      setNewEmail("");
      const res = await api.get("/api/ops/team/");
      setTeam(Array.isArray(res.data) ? res.data : res.data?.results || []);
    } catch (err: any) {
      showToast(
        err.response?.data?.error || err.response?.data?.email?.[0] || "Failed to add.",
        "error"
      );
    } finally {
      setAddingMember(false);
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
          Loading settings...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-950 shadow-sm">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            System Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Configure global toggles, academic options, and team permissions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* System Settings & Academic Options */}
        <div className="space-y-6">
          {/* General Toggles */}
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4 text-white" /> General Controls
            </h2>
            <div className="space-y-3">
              {[
                {
                  key: "maintenanceMode",
                  label: "Maintenance Mode",
                  desc: "Temporarily disable public access to the registration portal",
                },
                {
                  key: "registrationOpen",
                  label: "Global Registration Open",
                  desc: "Allow attendees to create new event registrations",
                },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl border border-neutral-800/80 bg-neutral-950/50 p-4 transition-colors"
                >
                  <div className="pr-4">
                    <p className="text-xs font-semibold text-white">{label}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                  <ModernToggle
                    value={!!settings[key]}
                    onChange={() => setSettings({ ...settings, [key]: !settings[key] })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Academic Options Management (Depts & Semesters) */}
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white" /> Academic Options &amp; Branches
            </h2>

            {/* Department Options */}
            <div className="mb-6">
              <label className="text-xs font-medium text-neutral-300 mb-2 block">
                Departments / Branches
              </label>
              <form onSubmit={handleAddDepartment} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. CSE, CY, EC, AI"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/50 min-h-[60px]">
                {departments.map((d) => (
                  <span
                    key={d}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200"
                  >
                    {d}
                    <button
                      type="button"
                      onClick={() => handleRemoveDepartment(d)}
                      className="text-neutral-400 hover:text-red-400 transition-colors ml-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Semester Options */}
            <div className="mb-6">
              <label className="text-xs font-medium text-neutral-300 mb-2 block">
                Semesters / Academic Years
              </label>
              <form onSubmit={handleAddSemester} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="e.g. S1, S2, S3... S8"
                  value={newSem}
                  onChange={(e) => setNewSem(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/50 min-h-[60px]">
                {semesters.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-200"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => handleRemoveSemester(s)}
                      className="text-neutral-400 hover:text-red-400 transition-colors ml-0.5 cursor-pointer"
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save System Settings</span>
            </button>
          </div>
        </div>

        {/* Team Management */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-white" /> Staff &amp; Team Management
          </h2>

          {/* Add member form */}
          <form onSubmit={handleAddTeamMember} className="flex gap-2">
            <input
              type="email"
              placeholder="colleague@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="flex-1 px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
            />
            <button
              type="submit"
              disabled={addingMember}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs tracking-wide transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {addingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>Add Staff</span>
            </button>
          </form>

          {/* Members list */}
          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {team.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl border border-neutral-800/80 bg-neutral-950/50 p-3.5 hover:border-neutral-700 transition-colors"
              >
                <div className="min-w-0 pr-3">
                  <p className="text-xs font-semibold text-white truncate">{member.email}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {member.is_superuser && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
                        Superuser
                      </span>
                    )}
                    {member.is_staff && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Staff
                      </span>
                    )}
                    {!member.is_superuser &&
                      Array.isArray(member.groups) &&
                      member.groups.includes("Admin") && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Admin Group
                        </span>
                      )}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id, member.email)}
                  disabled={member.is_superuser}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                  title="Remove Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {team.length === 0 && (
              <div className="rounded-xl border border-neutral-800 p-8 text-center">
                <p className="text-xs text-neutral-500">No team members listed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
