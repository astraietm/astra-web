import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ 
    icon: Icon = PackageOpen, 
    title = 'No records found', 
    description = 'There are no items to display matching your criteria.', 
    action = null,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-white/[0.08] bg-[#0E1017]/40 ${className}`}>
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-4">
                <Icon size={22} strokeWidth={1.75} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1 tracking-tight">
                {title}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
};

export default EmptyState;
