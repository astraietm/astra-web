import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Plus, Trash2, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import RazorpayPayment from '../payment/RazorpayPayment';

const HawkinsLabRegistrationModal = ({ isOpen, onClose, event, initialData }) => {
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState(['', '']); // Min 2 members
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [errorMsg, setErrorMsg] = useState('');
    const [registrationData, setRegistrationData] = useState(null);

    React.useEffect(() => {
        if (initialData) {
            setRegistrationData(initialData);
            setStatus('success');
        }
    }, [initialData, isOpen]);
    
    // Initialize payment hook
    const handlePayment = RazorpayPayment();

    const addMember = () => {
        if (teamMembers.length < 4) {
            setTeamMembers([...teamMembers, '']);
        }
    };

    const removeMember = (index) => {
        if (teamMembers.length > 2) {
            setTeamMembers(teamMembers.filter((_, i) => i !== index));
        }
    };

    const updateMember = (index, value) => {
        const updated = [...teamMembers];
        updated[index] = value;
        setTeamMembers(updated);
    };

    const handlePaymentSuccess = (registration) => {
        setStatus('success');
        setRegistrationData(registration);
    };

    const handlePaymentFailure = (error) => {
        setStatus('error');
        setErrorMsg(error);
    };

    const initiatePayment = async () => {
        // Validate inputs
        if (!teamName.trim()) {
            setErrorMsg('Please enter a team name');
            setStatus('error');
            return;
        }

        const filledMembers = teamMembers.filter(m => m.trim());
        if (filledMembers.length < 2) {
            setErrorMsg('Please add at least 2 team members');
            setStatus('error');
            return;
        }

        if (filledMembers.length > 4) {
            setErrorMsg('Maximum 4 team members allowed');
            setStatus('error');
            return;
        }

        setStatus('processing');
        setErrorMsg('');

        // Trigger payment
        await handlePayment({
            eventId: event.id,
            eventName: event.title,
            amount: event.payment_amount,
            teamName: teamName,
            teamMembers: JSON.stringify(filledMembers),
            onSuccess: handlePaymentSuccess,
            onFailure: handlePaymentFailure
        });
    };

    const downloadQR = () => {
        if (!registrationData?.qr_code) return;
        const link = document.createElement('a');
        link.href = registrationData.qr_code;
        link.download = `${(registrationData?.team_name || teamName).replace(/\s+/g, '_')}_HawkinsLab_Ticket.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const resetAndClose = () => {
        setTeamName('');
        setTeamMembers(['', '']);
        setStatus('idle');
        setErrorMsg('');
        setRegistrationData(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={status === 'success' ? null : resetAndClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#0A0A0A] border border-red-900/30 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-red-900/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

                    {/* Content */}
                    <div className="relative z-10 p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Team Registration</h2>
                                <p className="text-zinc-400 text-sm">Hawkins Lab • ₹100 per team</p>
                            </div>
                            <button
                                onClick={resetAndClose}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        {/* Success State */}
                        {status === 'success' && registrationData ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-8"
                            >
                                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                    <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping" />
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {initialData ? 'Access Granted' : 'Payment Successful!'}
                                </h3>
                                <p className="text-zinc-400 mb-8">
                                    {initialData ? 'Authorized Personnel Ticket' : 'Your team has been registered for Hawkins Lab'}
                                </p>

                                {/* QR Code */}
                                <div className="bg-white p-6 rounded-2xl border-4 border-green-500/20 shadow-inner mb-8 mx-auto inline-block">
                                    <img
                                        src={registrationData.qr_code}
                                        alt="Team QR Code"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={downloadQR}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                                    >
                                        <CreditCard className="w-5 h-5" /> Download Team Ticket
                                    </button>
                                    <button
                                        onClick={resetAndClose}
                                        className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Error Message */}
                                {status === 'error' && errorMsg && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span className="text-sm">{errorMsg}</span>
                                    </motion.div>
                                )}

                                {/* Team Name */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                                        Team Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        placeholder="e.g., Code Breakers"
                                        disabled={status === 'processing'}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:bg-red-950/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                {/* Team Members */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-zinc-400 mb-3">
                                        Team Members (2-4) *
                                    </label>
                                    <div className="space-y-3">
                                        {teamMembers.map((member, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={member}
                                                    onChange={(e) => updateMember(index, e.target.value)}
                                                    placeholder={`Member ${index + 1} Name`}
                                                    disabled={status === 'processing'}
                                                    className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:bg-red-950/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                                {teamMembers.length > 2 && (
                                                    <button
                                                        onClick={() => removeMember(index)}
                                                        disabled={status === 'processing'}
                                                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {teamMembers.length < 4 && (
                                        <button
                                            onClick={addMember}
                                            disabled={status === 'processing'}
                                            className="mt-3 flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Plus className="w-4 h-4" /> Add Member
                                        </button>
                                    )}
                                </div>

                                {/* Payment Button */}
                                <button
                                    onClick={initiatePayment}
                                    disabled={status === 'processing'}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {status === 'processing' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            Pay ₹100 & Register Team
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-zinc-600 text-center mt-4">
                                    Secure payment powered by Razorpay
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default HawkinsLabRegistrationModal;
