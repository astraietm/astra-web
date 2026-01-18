import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, User, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const TeamRegistrationModal = ({ isOpen, onClose, event, onSuccess }) => {
    const { token, user } = useAuth();
    const toast = useToast();
    const [submitting, setSubmitting] = useState(false);
    
    // Limits
    const minMembers = (event?.team_size_min || 1) - 1; // Excluding lead
    const maxMembers = (event?.team_size_max || 4) - 1;
    
    const [teamName, setTeamName] = useState('');
    // Array of member names. Initialize with min required (empty strings)
    const [members, setMembers] = useState(Array(minMembers).fill(''));

    if (!isOpen) return null;

    const handleMemberChange = (index, value) => {
        const newMembers = [...members];
        newMembers[index] = value;
        setMembers(newMembers);
    };

    const addMember = () => {
        if (members.length < maxMembers) {
            setMembers([...members, '']);
        }
    };

    const removeMember = (index) => {
        if (members.length > minMembers) {
            const newMembers = members.filter((_, i) => i !== index);
            setMembers(newMembers);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!teamName.trim()) {
            toast.error("Team Name is required");
            return;
        }
        
        // Filter empty optional members
        const validMembers = members.filter(m => m.trim() !== '');
        
        if (validMembers.length < minMembers) {
            toast.error(`You need at least ${event.team_size_min} members (including you).`);
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                event: event.id,
                team_name: teamName,
                team_members: JSON.stringify(validMembers) // Store additional members
            };

            await axios.post(
                `${import.meta.env.VITE_API_URL}/register/`, 
                payload, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Team Registered Successfully!");
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => !submitting && onClose()}
                />

                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Team Registration</h2>
                                <p className="text-gray-400 text-sm">Assemble your squad for {event?.title}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Team Name */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Team Name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        required
                                        value={teamName}
                                        onChange={e => setTeamName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors pl-10"
                                        placeholder="e.g. The Hawkins Heroes"
                                    />
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                </div>
                            </div>

                            {/* Team Lead (Read Only) */}
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                                        You
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{user?.name || user?.email}</div>
                                        <div className="text-xs text-gray-500">Team Lead</div>
                                    </div>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>

                            {/* Members */}
                            <div className="space-y-3">
                                <label className="block text-xs font-medium text-gray-500 uppercase">Team Members ({members.length + 1}/{event?.team_size_max})</label>
                                {members.map((member, index) => (
                                    <div key={index} className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input 
                                                type="text" 
                                                required={index < minMembers}
                                                value={member}
                                                onChange={e => handleMemberChange(index, e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors pl-10"
                                                placeholder={`Member ${index + 2} Name`}
                                            />
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        </div>
                                        {index >= minMembers && (
                                            <button 
                                                type="button"
                                                onClick={() => removeMember(index)}
                                                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                
                                {members.length < maxMembers && (
                                    <button
                                        type="button"
                                        onClick={addMember}
                                        className="text-sm text-purple-400 hover:text-purple-300 font-medium py-2"
                                    >
                                        + Add Another Member
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
                            >
                                {submitting ? 'Registering Team...' : 'Complete Registration'}
                            </button>
                        </form>
                    </div>

                    {!submitting && (
                        <button 
                            onClick={onClose}
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

export default TeamRegistrationModal;
