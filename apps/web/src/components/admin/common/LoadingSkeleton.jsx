import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standard semantic table skeleton rows.
 * Complies with HTML5 table specs (tr > td).
 */
export const TableSkeleton = ({ rows = 6, cols = 5 }) => (
    <>
        {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-white/[0.04]">
                {Array.from({ length: cols }).map((_, j) => (
                    <td key={j} className="px-5 py-3.5">
                        <div 
                            className={`h-4 bg-white/[0.04] rounded animate-pulse ${
                                j === 0 ? 'w-24' : j === cols - 1 ? 'w-16 ml-auto' : 'w-3/4'
                            }`} 
                        />
                    </td>
                ))}
            </tr>
        ))}
    </>
);

/**
 * KPI Metric card skeletons for dashboard and statistics views.
 */
export const CardSkeleton = ({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-busy="true">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-3 animate-pulse">
                <div className="flex justify-between items-center">
                    <div className="h-3 w-24 bg-white/[0.06] rounded" />
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06]" />
                </div>
                <div className="h-8 w-28 bg-white/[0.08] rounded" />
                <div className="h-3 w-36 bg-white/[0.04] rounded" />
            </div>
        ))}
    </div>
);

/**
 * Chart container skeleton for Dashboard analytics.
 */
export const ChartSkeleton = () => (
    <div className="p-6 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-6 animate-pulse" aria-busy="true">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-4 w-36 bg-white/[0.08] rounded" />
                <div className="h-3 w-48 bg-white/[0.04] rounded" />
            </div>
            <div className="flex gap-2">
                <div className="h-7 w-12 bg-white/[0.04] rounded-lg" />
                <div className="h-7 w-12 bg-white/[0.04] rounded-lg" />
                <div className="h-7 w-12 bg-white/[0.04] rounded-lg" />
            </div>
        </div>
        <div className="h-64 w-full bg-white/[0.02] rounded-xl flex items-end p-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
                <div 
                    key={i} 
                    className="flex-1 bg-white/[0.04] rounded-t"
                    style={{ height: `${20 + (i * 7) % 65}%` }}
                />
            ))}
        </div>
    </div>
);

/**
 * Full page content skeleton (Header + KPI Cards + Content Panel).
 * Keeps the sidebar & topbar intact while content initializes.
 */
export const PageLoadingSkeleton = () => (
    <div className="space-y-6 pb-12 animate-pulse" aria-busy="true">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
            <div className="space-y-2">
                <div className="h-7 w-48 bg-white/[0.08] rounded-lg" />
                <div className="h-3.5 w-72 bg-white/[0.04] rounded" />
            </div>
            <div className="h-9 w-32 bg-white/[0.06] rounded-xl" />
        </div>

        {/* KPI Cards Row */}
        <CardSkeleton count={4} />

        {/* Content Block Skeleton */}
        <div className="p-6 rounded-2xl bg-[#111319] border border-white/[0.06] space-y-4">
            <div className="h-5 w-40 bg-white/[0.06] rounded" />
            <div className="h-48 w-full bg-white/[0.02] rounded-xl" />
        </div>
    </div>
);

/**
 * Reusable minimal inline spinner/indicator for buttons and badges.
 */
export const InlineLoading = ({ label = 'Loading...', size = 'sm' }) => {
    const sizeClasses = size === 'xs' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    return (
        <span className="inline-flex items-center gap-2 text-slate-400 font-medium">
            <Loader2 className={`${sizeClasses} animate-spin text-blue-400`} />
            {label && <span className="text-xs">{label}</span>}
        </span>
    );
};

export default {
    TableSkeleton,
    CardSkeleton,
    ChartSkeleton,
    PageLoadingSkeleton,
    InlineLoading
};
