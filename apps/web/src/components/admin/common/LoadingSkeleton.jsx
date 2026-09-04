import React from 'react';

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

export const CardSkeleton = ({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

export default { TableSkeleton, CardSkeleton };
