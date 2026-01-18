import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, School, BookOpen, Save, Layers } from 'lucide-react';
import axios from 'axios';

const CompleteProfileModal = () => {
    const { isProfileModalOpen, setIsProfileModalOpen, user, token, updateUser, pendingAction, setPendingAction } = useAuth();
    const toast = useToast();
    
    const [formData, setFormData] = useState({
        phone_number: user?.phone_number || '',
        college: user?.college || '',
        usn: user?.usn || ''
    });
    const [submitting, setSubmitting] = useState(false);

    if (!isProfileModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.phone_number || !formData.college) {
            toast.error('Phone number and College are required.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL}/auth/me/`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateUser(res.data);
            toast.success('Profile Updated!');
            setIsProfileModalOpen(false);
            
            // Execute pending action if any (e.g. Register for event)
            if (pendingAction) {
                pendingAction.run(token); // Pass token to be safe
                setPendingAction(null);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile.');
        } finally {
            setSubmitting(false);
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
                    className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-8">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                                <User className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Complete Your Profile</h2>
                            <p className="text-gray-400 text-sm">
                                We need a few more details to confirm your registration.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type="tel" 
                                        required
                                        value={formData.phone_number}
                                        onChange={e => setFormData({...formData, phone_number: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pl-10"
                                        placeholder="+91 99999 99999"
                                    />
                                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">College Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.college}
                                        onChange={e => setFormData({...formData, college: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pl-10"
                                        placeholder="Enter your college name"
                                    />
                                    <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">USN / Roll Number (Optional)</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.usn}
                                        onChange={e => setFormData({...formData, usn: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors pl-10"
                                        placeholder="University Seat No."
                                    />
                                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
                            >
                                {submitting ? 'Saving...' : 'Save & Continue'}
                                {!submitting && <Save className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>

                    {!submitting && (
                        <button 
                            onClick={() => setIsProfileModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
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
