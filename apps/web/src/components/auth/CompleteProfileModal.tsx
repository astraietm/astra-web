'use client';

import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const CompleteProfileModal: React.FC = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, user, updateUser, token, pendingAction, setPendingAction } =
    useAuth();
  const { showToast } = useToast();
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [college, setCollege] = useState(user?.college || '');
  const [usn, setUsn] = useState(user?.usn || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [semester, setSemester] = useState(user?.semester || '');
  const [saving, setSaving] = useState(false);

  const [departments, setDepartments] = useState<string[]>([
    "CSE", "CY", "EC", "EEE", "ME", "CE", "AD", "MCA", "BSH", "Other"
  ]);
  const [semesters, setSemesters] = useState<string[]>([
    "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "PG", "Faculty", "Other"
  ]);

  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get('/api/ops/public-config/');
        if (res.data.departments && Array.isArray(res.data.departments)) {
          setDepartments(res.data.departments);
        }
        if (res.data.semesters && Array.isArray(res.data.semesters)) {
          setSemesters(res.data.semesters);
        }
      } catch {
        // Fallback options preserved
      }
    };
    fetchOptions();
  }, []);

  React.useEffect(() => {
    if (user) {
      setPhone(user.phone_number || '');
      setCollege(user.college || '');
      setUsn(user.usn || '');
      setDepartment(user.department || '');
      setSemester(user.semester || '');
    }
  }, [user]);

  if (!isProfileModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !college) {
      showToast('Phone number and college are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch('/api/auth/me/', {
        phone_number: phone,
        college,
        usn,
        department,
        semester,
      });

      updateUser(res.data);
      showToast('Profile updated successfully!', 'success');
      setIsProfileModalOpen(false);

      if (pendingAction && token) {
        pendingAction.run(token);
        setPendingAction(null);
      }
    } catch (err) {
      console.error('Profile update failed', err);
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => !saving && setIsProfileModalOpen(false)}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white border-2 border-black overflow-hidden"
        >
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <h2 className="font-pixel text-sm font-bold uppercase tracking-wider">
              COMPLETE YOUR PROFILE
            </h2>
            {!saving && (
              <button onClick={() => setIsProfileModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <p className="text-sm text-gray-600 font-sans">
              We need your phone number, college, department and semester to complete event registrations.
            </p>

            <div>
              <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
                className="w-full px-4 py-3 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow"
              />
            </div>

            <div>
              <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">
                College / Institution *
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="KMCT Institute of Emerging Technology"
                required
                className="w-full px-4 py-3 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow shadow-[2px_2px_0px_#000] bg-white"
                >
                  <option value="">Select Dept</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-3 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow shadow-[2px_2px_0px_#000] bg-white"
                >
                  <option value="">Select Sem</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">
                USN / Roll Number
              </label>
              <input
                type="text"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-3 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-display font-bold text-sm uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> SAVING...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> SAVE PROFILE
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompleteProfileModal;
