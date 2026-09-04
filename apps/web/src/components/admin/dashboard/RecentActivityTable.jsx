import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Users, Copy, Check, ChevronRight } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const RecentActivityTable = ({ registrations = [], onSelectAttendee }) => {
    const navigate = useNavigate();
    const [copiedToken, setCopiedToken] = useState(null);

    const handleCopy = (e, token) => {
        e.stopPropagation();
        if (!token) return;
        navigator.clipboard.writeText(token);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    return (
        <div className="bg-[#111319] border border-white/[0.06] rounded-2xl p-5 sm:p-6 flex flex-col shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-white tracking-tight">Recent Registrations</h3>
                    <p className="text-xs text-slate-400 font-medium">Real-time attendee pass activity</p>
                </div>
                {registrations.length > 0 && (
                    <button
                        onClick={() => navigate('/admin/registrations')}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <span>View all</span>
                        <ArrowUpRight size={13} />
                    </button>
                )}
            </div>

            {/* Table or Empty State */}
            {registrations.length === 0 ? (
                <div className="py-6">
                    <EmptyState 
                        icon={Users}
                        title="No registrations yet" 
                        description="New attendee registrations will appear here once participants sign up."
                        actionLabel="View Registration Portal"
                        onAction={() => navigate('/events')}
                    />
                </div>
            ) : (
                <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 pr-4">Participant</th>
                                <th className="pb-3 px-4">Event</th>
                                <th className="pb-3 px-4">Pass</th>
                                <th className="pb-3 px-4 text-center">Status</th>
                                <th className="pb-3 px-4 text-right">Registered</th>
                                <th className="pb-3 pl-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03] text-xs">
                            {registrations.map((reg, idx) => {
                                const name = reg.user_name || reg.user_details?.full_name || 'Participant';
                                const email = reg.user_email || reg.user_details?.email || '';
                                const isCheckedIn = reg.is_used || reg.status === 'ATTENDED';
                                const eventTitle = reg.event_details?.title || 'Festival Event';
                                const token = reg.token || '';
                                const timestamp = reg.timestamp || reg.registration_date;

                                return (
                                    <tr 
                                        key={reg.id || token || idx}
                                        onClick={() => onSelectAttendee && onSelectAttendee(reg)}
                                        className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                    >
                                        {/* Participant */}
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                                                    {name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate max-w-[160px]">
                                                        {name}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 font-mono truncate max-w-[160px]">
                                                        {email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Event */}
                                        <td className="py-3 px-4 text-slate-300 font-medium truncate max-w-[180px]">
                                            {eventTitle}
                                        </td>

                                        {/* Pass Token */}
                                        <td className="py-3 px-4">
                                            {token ? (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleCopy(e, token)}
                                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                                                    title="Click to copy pass token"
                                                >
                                                    {copiedToken === token ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-400" />
                                                            <span className="text-emerald-400 text-[10px]">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3 text-slate-400" />
                                                            <span>{token.slice(0, 6)}...</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <span className="text-slate-500 font-mono text-[11px]">—</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4 text-center">
                                            <StatusBadge 
                                                status={isCheckedIn ? 'Checked In' : 'Confirmed'} 
                                            />
                                        </td>

                                        {/* Registered Date */}
                                        <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px] whitespace-nowrap">
                                            {timestamp ? new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '—'}
                                        </td>

                                        {/* Action */}
                                        <td className="py-3 pl-4 text-right">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectAttendee && onSelectAttendee(reg);
                                                }}
                                                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                                title="View attendee pass"
                                            >
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentActivityTable;
