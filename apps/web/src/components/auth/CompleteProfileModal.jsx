import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, School, BookOpen, Save, Layers } from 'lucide-react';
import axios from 'axios';

const CompleteProfileModal = () => {
    const { isProfileModalOpen, setIsProfileModalOpen, user, token, updateUser, pendingAction, setPendingAction } = useAuth();
    const toast = useToast();

    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        college: '',
        usn: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Sync formData with user object when modal opens
    useEffect(() => {
        if (user && isProfileModalOpen) {
            setFormData({
                full_name: user.name || user.full_name || user.email?.split('@')[0] || '',
                phone_number: user.phone_number || '',
                college: user.college || '',
                usn: user.usn || ''
            });
        }
    }, [isProfileModalOpen, user]);

    if (!isProfileModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.phone_number || !formData.college || !formData.full_name) {
            toast.error('Full Name, Phone number and College are required.');
            return;
        }

        setSubmitting(true);
        let success = false;
        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/auth/me/`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Normalize response data: backend returns full_name, frontend uses name
            const updatedUser = {
                ...res.data,
                name: res.data.full_name
            };

            updateUser(updatedUser);
            toast.success('Profile Updated!');
            setIsProfileModalOpen(false);
            success = true;
        } catch (error) {
            console.error('Profile Update Error:', error);
            toast.error(error.response?.data?.error || 'Failed to update profile.');
        } finally {
            setSubmitting(false);
        }

        // Execute pending action outside the previous catch to avoid misleading error messages
        if (success && pendingAction) {
            try {
                await pendingAction.run(token);
                setPendingAction(null);
            } catch (pendingError) {
                console.error('Pending Action Error:', pendingError);
                // The pending action (like handleRegister) usually has its own toast error
            }
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => !submitting && setIsProfileModalOpen(false)}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Top Gradient Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5 border border-white/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                <User className="w-7 h-7 text-blue-400" />
                            </div>
                            <h2 className="font-space text-2xl font-bold text-white mb-2 tracking-tight">
                                {pendingAction ? 'Complete Profile' : 'Edit Profile'}
                            </h2>
                            <p className="font-light text-gray-400 text-sm leading-relaxed max-w-[80%] mx-auto">
                                {pendingAction
                                    ? 'Finalize your registration by providing your contact and academic details.'
                                    : 'Update your contact and academic details below.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all pl-11 text-sm placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                        placeholder="Enter your full name"
                                    />
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                            </div>

                            {/* College Name */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">College Name <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        required
                                        list="college-options"
                                        value={formData.college}
                                        onChange={e => setFormData({ ...formData, college: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all pl-11 text-sm placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                        placeholder="Search or enter your college"
                                    />
                                    <datalist id="college-options">
                                        <option value="KMCT Institute Of Emerging Technology and Management" />
                                        <option value="KMCT College of Engineering" />
                                        <option value="AWH Engineering College" />
                                        <option value="NIT Calicut" />
                                        <option value="Government Engineering College, Kozhikode" />
                                    </datalist>
                                    <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                            </div>

                            {/* USN / Roll Number */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">USN / Roll Number (Optional)</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={formData.usn}
                                        onChange={e => setFormData({ ...formData, usn: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all pl-11 text-sm placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                        placeholder="University Seat No."
                                    />
                                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Mobile Number (India) <span className="text-red-500">*</span></label>
                                <div className="relative group">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                        <span className="text-gray-500 text-sm font-mono border-r border-white/10 pr-2">+91</span>
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone_number.replace(/^\+91\s?/, '')}
                                        onChange={e => setFormData({ ...formData, phone_number: '+91 ' + e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all pl-[4.5rem] font-mono text-sm placeholder:text-gray-600 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                                        placeholder="99999 99999"
                                        pattern="[0-9]{10}"
                                        maxLength="10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-white text-black font-bold uppercase tracking-wide text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-8 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                {submitting ? 'Saving...' : 'Save & Continue'}
                                {!submitting && <Save className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>

                    {!submitting && (
                        <button
                            onClick={() => setIsProfileModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CompleteProfileModal;
