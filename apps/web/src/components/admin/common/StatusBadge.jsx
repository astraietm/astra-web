import React from 'react';

const StatusBadge = ({ status, variant, label }) => {
    // Determine variant from status string if not explicitly given
    const normalized = (status || variant || '').toLowerCase();
    
    let styles = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    let dot = 'bg-slate-400';
    let displayLabel = label || status || 'Unknown';

    if (normalized.includes('check') || normalized.includes('attend') || normalized.includes('success') || normalized.includes('open') || normalized.includes('publish') || normalized.includes('valid') || normalized.includes('active')) {
        styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        dot = 'bg-emerald-400';
    } else if (normalized.includes('pending') || normalized.includes('draft') || normalized.includes('warn') || normalized.includes('review')) {
        styles = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        dot = 'bg-amber-400';
    } else if (normalized.includes('error') || normalized.includes('cancel') || normalized.includes('close') || normalized.includes('denied') || normalized.includes('reject') || normalized.includes('invalid') || normalized.includes('urgent')) {
        styles = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        dot = 'bg-rose-400';
    } else if (normalized.includes('info') || normalized.includes('regis') || normalized.includes('normal')) {
        styles = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        dot = 'bg-blue-400';
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${styles} whitespace-nowrap`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {displayLabel}
        </span>
    );
};

export default StatusBadge;
