import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    User, 
    Mail, 
    Calendar, 
    Ticket, 
    CheckCircle2, 
    Clock, 
    Copy, 
    Check, 
    QrCode,
    Users
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const AttendeeDrawer = ({ isOpen, onClose, attendee }) => {
    const [copied, setCopied] = React.useState(false);

    if (!attendee) return null;

    const copyToken = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isAttended = attendee.is_used || attendee.status === 'ATTENDED';

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer Panel */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0D0F15] border-l border-white/[0.08] z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Attendee Details</span>
                                <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                                    {attendee.user_name || attendee.user_details?.full_name || 'Participant'}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Status Card */}
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-medium">Verification Status</span>
                                <StatusBadge status={isAttended ? 'Checked In' : 'Registered'} />
                            </div>

                            {/* Ticket Identifier */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Ticket Token / QR Pass</label>
                                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.08] flex items-center justify-between">
                                    <code className="text-xs font-mono text-blue-400 font-semibold break-all select-all">
                                        {attendee.token || 'N/A'}
                                    </code>
                                    {attendee.token && (
                                        <button
                                            onClick={() => copyToken(attendee.token)}
                                            className="p-1.5 ml-2 rounded-md hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors shrink-0"
                                            title="Copy Token"
                                        >
                                            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Participant Information */}
                            <div className="space-y-3">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Participant Info</span>
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <User size={15} className="text-slate-400 shrink-0" />
                                        <div className="text-xs">
                                            <p className="text-slate-400 font-medium">Full Name</p>
                                            <p className="text-white font-semibold">{attendee.user_name || attendee.user_details?.full_name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                        <Mail size={15} className="text-slate-400 shrink-0" />
                                        <div className="text-xs truncate">
                                            <p className="text-slate-400 font-medium">Email Address</p>
                                            <p className="text-white font-semibold truncate">{attendee.user_email || attendee.user_details?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                    {attendee.team_name && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                            <Users size={15} className="text-slate-400 shrink-0" />
                                            <div className="text-xs">
                                                <p className="text-slate-400 font-medium">Team</p>
                                                <p className="text-purple-400 font-semibold">{attendee.team_name}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Event Information */}
                            <div className="space-y-3">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Event Registration</span>
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Event Name</span>
                                        <span className="text-white font-semibold text-right max-w-[60%]">{attendee.event_details?.title || 'Festival Event'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Registration Date</span>
                                        <span className="text-slate-300 font-mono">
                                            {attendee.timestamp || attendee.registration_date 
                                                ? new Date(attendee.timestamp || attendee.registration_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                                                : 'N/A'}
                                        </span>
                                    </div>
                                    {attendee.event_details?.venue && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Venue</span>
                                            <span className="text-slate-300">{attendee.event_details.venue}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-4 border-t border-white/[0.08] bg-[#0A0C11]">
                            <button
                                onClick={onClose}
                                className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-colors"
                            >
                                Close Details
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};

export default AttendeeDrawer;
