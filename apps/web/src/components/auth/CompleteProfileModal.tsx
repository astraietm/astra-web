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
  const [saving, setSaving] = useState(false);

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
          className="relative w-full max-w-md bg-white border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden"
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

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-gray-600 font-sans">
              We need your phone number and college to complete event registrations.
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
                className="w-full px-4 py-3 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow shadow-[2px_2px_0px_#000]"
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
                className="w-full px-4 py-3 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow shadow-[2px_2px_0px_#000]"
              />
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
                className="w-full px-4 py-3 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow shadow-[2px_2px_0px_#000]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-display font-bold text-sm uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-colors shadow-[3px_3px_0px_#000] disabled:opacity-50"
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
