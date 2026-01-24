import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, User, Shield, CheckCircle, ArrowRight, 
  CreditCard, Sparkles, ChevronRight, Edit3, Lock 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import useRazorpayPayment from '../payment/RazorpayPayment';

const TeamRegistrationModal = ({ isOpen, onClose, event, onSuccess }) => {
    const { token, user } = useAuth();
    const toast = useToast();
    const handlePayment = useRazorpayPayment();
    
    const [step, setStep] = useState(1); // 1: Details, 2: Preview/Payment
    const [submitting, setSubmitting] = useState(false);
    
    // Limits
    const minMembers = (event?.team_size_min || 1) - 1; // Excluding lead
    const maxMembers = (event?.team_size_max || 4) - 1;
    
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState(Array(minMembers).fill(''));

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setTeamName('');
            setMembers(Array(minMembers).fill(''));
        }
    }, [isOpen, minMembers]);

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

    const nextStep = (e) => {
        e.preventDefault();
        if (!teamName.trim()) {
            toast.error("Team Name is required");
            return;
        }
        // Validate required members
        const requiredMembersFilled = members.slice(0, minMembers).every(m => m.trim() !== '');
        if (!requiredMembersFilled) {
            toast.error(`Please fill all ${minMembers + 1} required member names.`);
            return;
        }
        setStep(2);
    };

    const handleRegistration = async () => {
        const validMembers = members.filter(m => m.trim() !== '');
        setSubmitting(true);

        try {
            if (event.is_paid) {
                await handlePayment({
                    eventId: event.id,
                    eventName: event.title,
                    amount: event.payment_amount || parseInt(event.fee?.replace(/\D/g, '') || '0'),
                    teamName: teamName,
                    teamMembers: JSON.stringify(validMembers),
                    onSuccess: (registration) => {
                        toast.success("Payment Successful! Team Registered.");
                        onSuccess(registration);
                        onClose();
                    },
                    onFailure: (error) => {
                        toast.error(error);
                        setSubmitting(false);
                    }
                });
            } else {
                const payload = {
                    event: event.id,
                    team_name: teamName,
                    team_members: JSON.stringify(validMembers)
                };

                await axios.post(
                    `${import.meta.env.VITE_API_URL}/register/`, 
                    payload, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success("Team Registered Successfully!");
                onSuccess();
                onClose();
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed");
            setSubmitting(false);
        }
    };

    const validMembersList = members.filter(m => m.trim() !== '');

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    onClick={() => !submitting && onClose()}
                />

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    className="relative w-full max-w-xl bg-[#050505] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    {/* Top Aesthetic Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
                    
                    <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                    <Sparkles className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Premium Registration</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-space font-bold text-white tracking-tighter leading-none">
                                    {step === 1 ? 'Build Your Squad' : 'Final Review'}
                                </h2>
                                <p className="text-gray-500 mt-2 text-sm">
                                    {step === 1 ? `Assembling for ${event?.title}` : 'Verify your details before proceeding to checkout'}
                                </p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Step Indicator */}
                        <div className="flex gap-2 mb-10">
                            {[1, 2].map(i => (
                                <div 
                                    key={i} 
                                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'}`} 
                                />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.form 
                                    key="step1"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    onSubmit={nextStep} 
                                    className="space-y-8"
                                >
                                    {/* Team Name */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Team Identity</label>
                                            <span className="text-[10px] text-red-500/70 font-medium">Required</span>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl group-focus-within:bg-blue-500/10 transition-all" />
                                            <input 
                                                type="text" 
                                                required
                                                value={teamName}
                                                onChange={e => setTeamName(e.target.value)}
                                                className="relative w-full bg-[#0A0A0A]/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all pl-12 placeholder:text-gray-700"
                                                placeholder="Enter a powerful team name..."
                                            />
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                    </div>

                                    {/* Members Section */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Team Roster ({members.length + 1}/{event?.team_size_max})
                                            </label>
                                            <span className="text-[10px] text-gray-600 font-medium">Click to add up to {event?.team_size_max}</span>
                                        </div>

                                        {/* Lead */}
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-green-500/5 rounded-2xl blur-md" />
                                            <div className="relative p-4 bg-[#0A0A0A]/50 border border-white/5 rounded-2xl flex items-center justify-between border-green-500/20">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{user?.full_name || user?.name || user?.email}</div>
                                                        <div className="text-[10px] text-green-500/70 uppercase tracking-widest font-black">Authorized Lead</div>
                                                    </div>
                                                </div>
                                                <CheckCircle className="w-5 h-5 text-green-500/50" />
                                            </div>
                                        </div>

                                        {/* Dynamic Members */}
                                        <div className="space-y-4">
                                            {members.map((member, index) => (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    key={index} 
                                                    className="flex gap-3"
                                                >
                                                    <div className="relative flex-1 group">
                                                        <input 
                                                            type="text" 
                                                            required={index < minMembers}
                                                            value={member}
                                                            onChange={e => handleMemberChange(index, e.target.value)}
                                                            className="w-full bg-[#0A0A0A]/80 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all pl-12 placeholder:text-gray-700"
                                                            placeholder={`Combatant ${index + 2} Details`}
                                                        />
                                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                                    </div>
                                                    {index >= minMembers && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeMember(index)}
                                                            className="p-4 bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-2xl border border-white/5 transition-all"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                        
                                        {members.length < maxMembers && (
                                            <button
                                                type="button"
                                                onClick={addMember}
                                                className="w-full py-4 border-2 border-dashed border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 rounded-2xl text-sm font-bold text-gray-500 hover:text-blue-400 transition-all flex items-center justify-center gap-2 group"
                                            >
                                                <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                Add Team Member
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 mt-10 group"
                                    >
                                        <span>Proceed to Review</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div 
                                    key="step2"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden">
                                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Confirmation Summary</h3>
                                            <button 
                                                onClick={() => setStep(1)}
                                                className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
                                            >
                                                <Edit3 className="w-3 h-3" />
                                                Edit Details
                                            </button>
                                        </div>
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-sm">Team Name</span>
                                                <span className="text-white font-bold">{teamName}</span>
                                            </div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-gray-500 text-sm">Members</span>
                                                <div className="text-right">
                                                    <div className="text-white font-medium text-sm">{user?.name} (Lead)</div>
                                                    {validMembersList.map((m, i) => (
                                                        <div key={i} className="text-gray-400 text-xs mt-1">{m}</div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                                <span className="text-gray-500 text-sm">Event</span>
                                                <span className="text-white font-bold">{event?.title}</span>
                                            </div>
                                            <div className="pt-2 flex justify-between items-center">
                                                 <span className="text-gray-500 text-sm">Total Fee</span>
                                                 <span className="text-2xl font-space font-black text-white">{event?.fee || '₹100'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                            <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                                Your transaction is protected by bank-grade security. By proceeding, you agree to our Terms & Conditions for event registration.
                                            </p>
                                        </div>
                                        
                                        <button
                                            onClick={handleRegistration}
                                            disabled={submitting}
                                            className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                                        >
                                            {submitting ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                    <span>Pay & Register</span>
                                                    <ChevronRight className="w-5 h-5 opacity-50" />
                                                </>
                                            )}
                                        </button>
                                        
                                        <button 
                                            onClick={() => setStep(1)}
                                            disabled={submitting}
                                            className="w-full py-3 text-gray-500 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors"
                                        >
                                            Cancel Transaction
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TeamRegistrationModal;
