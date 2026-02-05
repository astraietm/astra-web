import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    ShieldCheck, 
    XCircle, 
    CheckCircle, 
    Loader2, 
    Scan, 
    AlertTriangle, 
    ArrowLeft, 
    Clock, 
    Zap, 
    Cpu, 
    History, 
    SearchX, 
    Globe, 
    Terminal,
    Shield,
    Database,
    ZapOff,
    Activity,
    UserCheck,
    Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminScanner = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null); 
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [scanHistory, setScanHistory] = useState([]);

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleScan = async (detectedCodes) => {
        if (!isScanning || isLoading) return;
        
        const code = detectedCodes[0]?.rawValue;
        if (!code) return;

        setIsScanning(false);
        setIsLoading(true);

        let tokenToVerify = code;
        if (code.includes('/verify/')) {
             tokenToVerify = code.split('/verify/')[1].replace('/', '');
        } 

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/operations/verify/${tokenToVerify}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            const result = {
                status: data.valid ? 'success' : 'error',
                data: data,
                timestamp: new Date(),
                id: Math.random().toString(36).substr(2, 9)
            };

            setScanResult(result);
            setScanHistory(prev => [result, ...prev].slice(0, 10));
        } catch (err) {
            console.error("Verification failed", err);
            setScanResult({ 
                status: 'error', 
                data: { message: "PROTOCOL_INTERRUPTION" },
                timestamp: new Date()
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setIsScanning(true);
    };

    return (
        <div className="flex flex-col h-full space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">Identity_verification</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Access_Control_Scanner</h1>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono uppercase tracking-tight leading-relaxed">
                            Scan Identity QR codes to authenticate event nodes and authorize sector access.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 p-6 rounded-[1.5rem] bg-white/[0.01] border border-white/[0.05] relative overflow-hidden group">
                     <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                     <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,1)]" />
                         SYSTEM_ACTIVE
                    </div>
                     <div className="h-8 w-px bg-white/[0.05]" />
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-slate-500">
                            <Shield size={16} />
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Protocol_Secure</span>
                     </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col xl:flex-row gap-10 min-h-0 relative">
                {/* Scanner View */}
                <div className="flex-1 relative bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center p-10 xl:p-20 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.03] via-transparent to-transparent pointer-events-none" />
                    
                    <div className="relative w-full max-w-xl aspect-square rounded-[3rem] overflow-hidden border border-white/[0.05] shadow-[0_0_100px_rgba(37,99,235,0.05)] bg-black/40 backdrop-blur-3xl group-hover:scale-[1.01] transition-transform duration-700">
                        {/* HUD Elements */}
                        <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-blue-600/30 z-20 rounded-tl-2xl" />
                        <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-blue-600/30 z-20 rounded-tr-2xl" />
                        <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-blue-600/30 z-20 rounded-bl-2xl" />
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-blue-600/30 z-20 rounded-br-2xl" />
                        
                        <div className="absolute top-1/2 left-10 right-10 h-px bg-white/5 z-20 pointer-events-none" />
                        <div className="absolute left-1/2 top-10 bottom-10 w-px bg-white/5 z-20 pointer-events-none" />

                        {isScanning && !scanResult && (
                            <div className="w-full h-full relative z-10 transition-opacity duration-1000">
                                <Scanner 
                                    onScan={handleScan}
                                    components={{ audio: false, finder: false }}
                                    styles={{ container: { width: '100%', height: '100%' } }}
                                />
                                {/* Scanning Effect */}
                                <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-blue-500/20 to-transparent shadow-[0_0_50px_rgba(59,130,246,0.3)] z-10 animate-scan pointer-events-none border-t border-blue-500/40" />
                                
                                <div className="absolute bottom-12 left-0 right-0 text-center z-20">
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">Awaiting_Input...</span>
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-[#030303]/95 z-40 flex flex-col items-center justify-center space-y-8 backdrop-blur-xl"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full border-2 border-blue-500/10 flex items-center justify-center">
                                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" strokeWidth={3} />
                                        </div>
                                        <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-[spin_1s_linear_infinite]" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">VERIFYING_IDENTITY</p>
                                        <p className="text-[9px] font-mono text-blue-500 uppercase tracking-widest animate-pulse">ACCESS_LEVEL: OPERATIONS_ROOT</p>
                                    </div>
                                </motion.div>
                            )}

                            {scanResult && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute inset-0 z-50 bg-[#030303] flex flex-col items-center justify-center p-12 text-center"
                                >
                                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent top-0" />
                                    
                                    {scanResult.status === 'success' ? (
                                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full space-y-12">
                                            <div className="space-y-4">
                                                <div className="w-24 h-24 rounded-full bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                                    <UserCheck className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">ACCESS_GRANTED</h2>
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">IDENTITY_VALIDATED_SECURE</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white/[0.01] rounded-[2rem] p-8 border border-white/[0.05] space-y-8 text-left relative group">
                                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Identity_Node</span>
                                                        <span className="text-2xl font-black text-white block uppercase tracking-tight truncate leading-none">
                                                            {scanResult.data.registrant.user_details.full_name || 'Admin User'}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1.5 pt-4">
                                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">Assigned_Event</span>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                            <span className="text-sm font-black text-blue-500 block uppercase tracking-wide truncate">
                                                                {scanResult.data.registrant.event_details.title}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {scanResult.data.registrant.team_name && (
                                                    <div className="pt-8 border-t border-white/[0.05] flex items-center justify-between">
                                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">TACT_UNIT</span>
                                                        <div className="px-4 py-2 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[9px] font-black text-purple-400 uppercase tracking-[0.2em]">
                                                            {scanResult.data.registrant.team_name}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full space-y-12">
                                            <div className="space-y-4">
                                                <div className="w-24 h-24 rounded-full bg-rose-500/5 border border-rose-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(244,63,94,0.1)]">
                                                    <Lock className="w-10 h-10 text-rose-500" strokeWidth={1.5} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">ACCESS_DENIED</h2>
                                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">
                                                        {scanResult.data.message || "UNAUTHORIZED_TOKEN"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="py-10 px-8 rounded-[2rem] bg-rose-500/[0.02] border border-rose-500/10 text-[10px] font-mono font-medium text-slate-400 leading-relaxed uppercase tracking-widest text-center">
                                                THE_PROVIDED_IDENTITY_SIGNATURE_COULD_NOT_BE_AUTHENTICATED_WITHIN_LOC_GRID. CONTACT_CMDR_FOR_RE_EVALUATION.
                                            </div>
                                        </motion.div>
                                    )}

                                    <button 
                                        onClick={resetScan}
                                        className="mt-12 w-full h-16 bg-blue-600 rounded-[1.5rem] text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-[0_12px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5"
                                    >
                                        <Scan size={18} strokeWidth={3} />
                                        RE-INIT_SCANNER
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* History Stream */}
                <div className="w-full xl:w-[450px] flex flex-col gap-10 h-full">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-6">
                         <div className="bg-white/[0.01] border border-white/[0.03] p-8 rounded-[2rem] space-y-4 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/[0.02] rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                             <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] block relative z-10">AUTH_PASS</span>
                             <div className="flex items-baseline gap-2 relative z-10">
                                 <span className="text-4xl font-black text-white tabular-nums tracking-tighter">{scanHistory.filter(s=>s.status==='success').length}</span>
                                 <span className="text-[10px] font-mono text-emerald-500">NODES</span>
                             </div>
                         </div>
                         <div className="bg-white/[0.01] border border-white/[0.03] p-8 rounded-[2rem] space-y-4 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/[0.02] rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                             <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] block relative z-10">AUTH_FAIL</span>
                             <div className="flex items-baseline gap-2 relative z-10">
                                 <span className="text-4xl font-black text-rose-500 tabular-nums tracking-tighter">{scanHistory.filter(s=>s.status!=='success').length}</span>
                                 <span className="text-[10px] font-mono text-rose-500">NODES</span>
                             </div>
                         </div>
                    </div>

                    {/* History List */}
                    <div className="flex-1 bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] relative overflow-hidden flex flex-col min-h-0">
                        <div className="p-8 border-b border-white/[0.03] bg-black/40 flex items-center justify-between sticky top-0 z-10 backdrop-blur-3xl">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/5 flex items-center justify-center">
                                    <Activity size={16} className="text-blue-500" />
                                </div>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">SECURE_ACTIVITY_STREAM</h3>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {scanHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-8 py-20">
                                    <Scan size={60} strokeWidth={1} />
                                    <div className="text-center space-y-2">
                                        <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">STREAM_EMPTY</p>
                                        <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">System_Ready_For_Uplink</p>
                                    </div>
                                </div>
                            ) : (
                                scanHistory.map((scan) => (
                                    <motion.div 
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        key={scan.id} 
                                        className={`p-6 rounded-[1.5rem] border ${scan.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'} space-y-5 group hover:bg-white/[0.02] transition-all relative overflow-hidden duration-500`}
                                    >
                                       <div className="flex justify-between items-center relative z-10">
                                           <div className={`flex items-center gap-3 text-[8px] font-black uppercase tracking-[0.3em] ${scan.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                               <div className={`w-1.5 h-1.5 rounded-full ${scan.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                               {scan.status === 'success' ? 'AUTH_PASSED' : 'AUTH_FAILED'}
                                           </div>
                                           <span className="text-[9px] font-black text-slate-800 font-mono tracking-tighter group-hover:text-slate-500 transition-colors">
                                               {scan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                                           </span>
                                       </div>
                                       
                                       {scan.status === 'success' ? (
                                           <div className="relative z-10 space-y-2">
                                               <p className="text-sm font-black text-white truncate group-hover:text-blue-500 transition-colors uppercase tracking-tight">{scan.data.registrant.user_details.full_name}</p>
                                               <div className="flex items-center gap-3">
                                                   <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                   <p className="text-[9px] font-black text-slate-600 truncate uppercase tracking-widest">{scan.data.registrant.event_details.title}</p>
                                               </div>
                                           </div>
                                       ) : (
                                           <div className="relative z-10">
                                                <p className="text-[10px] font-black text-rose-500/80 uppercase tracking-widest bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">{scan.data.message}</p>
                                           </div>
                                       )}
                                       
                                       <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    </motion.div>
                                ))
                            )}
                        </div>
                        <div className="p-6 border-t border-white/[0.03] bg-black/40 text-center">
                             <button className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em] hover:text-white hover:tracking-[0.6em] transition-all duration-500">Purge_Activity_Stream</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminScanner;
