import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, XCircle, CheckCircle, Loader2, Scan, AlertTriangle, ArrowLeft, Clock, Zap, Cpu, History, SearchX, Globe, Terminal } from 'lucide-react';
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/verify/${tokenToVerify}/`, {
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
                data: { message: "Network Error" },
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
        <div className="flex flex-col h-[calc(100vh-160px)] space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">QR Scanner</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider relative z-10">Verification</h1>
                        <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
                            Scan user QR codes for event check-in and fast verification.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                     <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                         Active
                    </div>
                     <div className="h-8 w-px bg-white/[0.08]" />
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Camera Ready</span>
                     </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
                {/* Scanner View */}
                <div className="flex-1 relative bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden flex flex-col items-center justify-center p-8">
                    <div className="relative w-full max-w-lg aspect-square rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl bg-black">
                        
                        {/* HUD Elements */}
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-blue-600 z-20 rounded-tl-xl opacity-50" />
                        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-blue-600 z-20 rounded-tr-xl opacity-50" />
                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-blue-600 z-20 rounded-bl-xl opacity-50" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-blue-600 z-20 rounded-br-xl opacity-50" />
                        
                        {isScanning && !scanResult && (
                            <div className="w-full h-full relative z-0">
                                <Scanner 
                                    onScan={handleScan}
                                    components={{ audio: false, finder: false }}
                                    styles={{ container: { width: '100%', height: '100%' } }}
                                />
                                {/* Scanning Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] z-10 animate-scan pointer-events-none" />
                            </div>
                        )}

                        <AnimatePresence>
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/95 z-40 flex flex-col items-center justify-center space-y-4 backdrop-blur-md"
                                >
                                    <div className="relative">
                                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                    </div>
                                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest animate-pulse">Verifying...</p>
                                </motion.div>
                            )}

                            {scanResult && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center"
                                >
                                    {scanResult.status === 'success' ? (
                                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full space-y-8">
                                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                                                <CheckCircle className="w-12 h-12 text-emerald-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Access Granted</h2>
                                                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Verification Successful</p>
                                            </div>
                                            
                                            <div className="bg-white/[0.03] rounded-2xl p-8 border border-white/[0.05] space-y-6 text-left">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name</span>
                                                    <span className="text-xl font-bold text-white block truncate">
                                                        {scanResult.data.registrant.user_details.full_name || 'Admin User'}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Event</span>
                                                    <span className="text-sm font-bold text-blue-500 block truncate">
                                                        {scanResult.data.registrant.event_details.title}
                                                    </span>
                                                </div>
                                                {scanResult.data.registrant.team_name && (
                                                    <div className="pt-6 border-t border-white/[0.05]">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Team</span>
                                                        <div className="inline-flex px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs font-bold text-purple-400 uppercase tracking-wider">
                                                            {scanResult.data.registrant.team_name}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full space-y-8">
                                            <div className="w-24 h-24 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
                                                <XCircle className="w-12 h-12 text-rose-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Access Denied</h2>
                                                <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">
                                                    {scanResult.data.message || "Invalid Token"}
                                                </p>
                                            </div>
                                            <div className="py-8 px-6 rounded-2xl bg-white/[0.02] border border-white/10 text-xs font-medium text-slate-400 leading-relaxed">
                                                The provided QR code could not be verified. Please try again or contact support.
                                            </div>
                                        </motion.div>
                                    )}

                                    <button 
                                        onClick={resetScan}
                                        className="mt-8 w-full group overflow-hidden relative"
                                    >
                                        <div className="relative h-14 w-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all">
                                            <Scan size={18} />
                                            Scan Next
                                        </div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* History Stream */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6 h-full">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-[#0a0a0a] border border-white/[0.08] p-5 rounded-2xl space-y-1">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Verified</span>
                             <span className="text-2xl font-bold text-white font-mono">{scanHistory.filter(s=>s.status==='success').length}</span>
                         </div>
                         <div className="bg-[#0a0a0a] border border-white/[0.08] p-5 rounded-2xl space-y-1">
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Failed</span>
                             <span className="text-2xl font-bold text-rose-500 font-mono">{scanHistory.filter(s=>s.status!=='success').length}</span>
                         </div>
                    </div>

                    {/* History List */}
                    <div className="flex-1 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl relative overflow-hidden flex flex-col min-h-0">
                        <div className="p-6 border-b border-white/[0.08] bg-black/40 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <History size={16} className="text-blue-500" />
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Scans</h3>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {scanHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4 py-12">
                                    <Scan size={40} />
                                    <p className="text-xs font-bold uppercase tracking-wider">Ready to Scan</p>
                                </div>
                            ) : (
                                scanHistory.map((scan) => (
                                    <motion.div 
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        key={scan.id} 
                                        className={`p-4 rounded-xl border ${scan.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'} space-y-3 group hover:bg-white/[0.02] transition-all`}
                                    >
                                       <div className="flex justify-between items-center">
                                           <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider ${scan.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                               <div className={`w-1.5 h-1.5 rounded-full ${scan.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                               {scan.status === 'success' ? 'Verified' : 'Failed'}
                                           </div>
                                           <span className="text-[10px] font-medium text-slate-500 font-mono">
                                               {scan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                           </span>
                                       </div>
                                       {scan.status === 'success' ? (
                                           <div>
                                               <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors">{scan.data.registrant.user_details.full_name}</p>
                                               <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{scan.data.registrant.event_details.title}</p>
                                           </div>
                                       ) : (
                                           <div>
                                                <p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-wide">{scan.data.message}</p>
                                           </div>
                                       )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-white/[0.08] bg-black/40 text-center">
                             <button className="text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Clear History</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminScanner;
