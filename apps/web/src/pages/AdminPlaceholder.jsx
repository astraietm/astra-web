import React from 'react';
import { Terminal, ShieldAlert, Cpu, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPlaceholder = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 relative overflow-hidden">
            {/* Ambient Pulse HUD */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-20 opacity-5 pointer-events-none">
                <Cpu size={200} className="text-blue-500 animate-pulse" />
                <Activity size={200} className="text-blue-500 animate-pulse delay-700" />
            </div>

            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
            >
                <div className="w-40 h-40 rounded-[3rem] bg-white/[0.01] border border-white/5 flex items-center justify-center text-slate-700 relative group">
                    <div className="absolute inset-0 bg-blue-500/5 rounded-[3rem] blur-2xl group-hover:bg-blue-500/10 transition-all animate-pulse" />
                    <ShieldAlert size={60} className="relative z-10 text-slate-800" />
                    
                    {/* Floating HUD Brackets */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-blue-500/20 rounded-tl-xl" />
                    <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-blue-500/20 rounded-br-xl" />
                </div>
            </motion.div>

            <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-10 bg-blue-500/40" />
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Sector Restricted</span>
                    <div className="h-px w-10 bg-blue-500/40" />
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter max-w-lg leading-none">
                    {title || "Module Hardening In Progress"}
                </h1>
                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                    <Terminal size={14} className="text-blue-500" />
                    STATUS: SYNCING_ENCRYPTED_DATA_LAYERS
                </div>
            </div>

            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest max-w-sm leading-relaxed opacity-60">
                The requested administrative sector is currently undergoing security hardening. 
                Please re-authenticate after the next scheduled system synchronization.
            </p>

            <div className="pt-10 grid grid-cols-4 gap-4 w-full max-w-xs">
                {[1,2,3,4,8,7,6,5].map(i => (
                    <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden relative">
                         <div className="absolute inset-0 bg-blue-500/20 animate-loading-bar" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    </div>
                ))}
            </div>
            
            <div className="pt-12">
                 <button className="px-10 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-500 hover:border-blue-500/30 transition-all flex items-center gap-2">
                    <Zap size={14} />
                    Report Anomaly
                 </button>
            </div>
        </div>
    );
};

export default AdminPlaceholder;
