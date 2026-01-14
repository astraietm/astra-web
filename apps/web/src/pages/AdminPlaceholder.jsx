import React from 'react';
import { Terminal, ShieldAlert } from 'lucide-react';

const AdminPlaceholder = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-700 animate-pulse">
                <ShieldAlert size={40} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-widest uppercase mb-2">
                    {title || "Module Under Construction"}
                </h1>
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-primary uppercase tracking-[0.3em]">
                    <Terminal size={14} />
                    Status: Accessing_Restricted_Data
                </div>
            </div>
            <p className="text-gray-500 text-sm max-w-xs font-mono">
                The requested administrative module is currently undergoing security hardening. 
                Please check back after the next system synchronization.
            </p>
            <div className="pt-8 grid grid-cols-4 gap-2 w-full max-w-xs">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary/20 animate-loading-bar" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPlaceholder;
