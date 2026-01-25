import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, XCircle, CheckCircle, Loader2, Scan, AlertTriangle, ArrowLeft, Clock, Zap } from 'lucide-react';
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
                data: { message: "Uplink Failure" },
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
        <div className="flex flex-col h-[calc(100vh-140px)] bg-[#050505] rounded-[2.5rem] border border-white/5 overflow-hidden relative font-inter">
            {/* Mission Header */}
            <div className="relative z-20 px-10 py-6 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl flex justify-between items-center">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Node Verification</span>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Pass Scanner V0.1</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-500 tracking-widest uppercase">
                        Live Stream Active
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden relative z-10">
                {/* Scanner Core */}
                <div className="flex-1 relative flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-500/[0.02] to-transparent">
                    
                    <div className="relative w-full max-w-lg aspect-square rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
                        {/* Corner Visuals */}
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-[3px] border-l-[3px] border-blue-500 z-20 rounded-tl-xl opacity-60" />
                        <div className="absolute top-8 right-8 w-12 h-12 border-t-[3px] border-r-[3px] border-blue-500 z-20 rounded-tr-xl opacity-60" />
                        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-[3px] border-l-[3px] border-blue-500 z-20 rounded-bl-xl opacity-60" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-[3px] border-r-[3px] border-blue-500 z-20 rounded-br-xl opacity-60" />

                        {isScanning && !scanResult && (
                            <div className="w-full h-full relative">
                                <Scanner 
                                    onScan={handleScan}
                                    components={{ audio: false, finder: false }}
                                    styles={{ container: { width: '100%', height: '100%' } }}
                                />
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/20 to-transparent z-10 animate-scan pointer-events-none" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10 pointer-events-none" />
                            </div>
                        )}

                        {isLoading && (
                            <div className="absolute inset-0 bg-[#050505]/95 z-40 flex flex-col items-center justify-center space-y-4">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" strokeWidth={3} />
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">Decrypting Identity...</p>
                            </div>
                        )}

                        <AnimatePresence>
                            {scanResult && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-50 bg-[#050505]/98 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center"
                                >
                                    {scanResult.status === 'success' ? (
                                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full space-y-8">
                                            <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                                                <CheckCircle className="w-12 h-12 text-emerald-500" strokeWidth={2.5} />
                                            </div>
                                            <div className="space-y-2">
                                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">ACCESS GRANTED</h2>
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Credentials Validated</p>
                                            </div>
                                            
                                            <div className="bg-white/[0.03] rounded-[2rem] p-8 border border-white/5 space-y-6 text-left shadow-inner">
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Personnel Identity</span>
                                                    <span className="text-xl font-black text-white uppercase tracking-tight">{scanResult.data.registrant.user_details.full_name || 'Classified User'}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Mission Sector</span>
                                                    <span className="text-lg font-black text-blue-500 uppercase tracking-tight">{scanResult.data.registrant.event_details.title}</span>
                                                </div>
                                                {scanResult.data.registrant.team_name && (
                                                    <div className="pt-4 border-t border-white/5">
                                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Squad Designation</span>
                                                        <span className="text-base font-black text-purple-500 uppercase tracking-tight">{scanResult.data.registrant.team_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full space-y-8">
                                            <div className="w-24 h-24 rounded-[2rem] bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(244,63,94,0.1)]">
                                                <XCircle className="w-12 h-12 text-rose-500" strokeWidth={2.5} />
                                            </div>
                                            <div className="space-y-2">
                                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">ACCESS DENIED</h2>
                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">{scanResult.data.message || "Invalid Protocol"}</p>
                                            </div>
                                        </motion.div>
                                    )}

                                    <button 
                                        onClick={resetScan}
                                        className="mt-10 w-full h-16 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                                    >
                                        <Scan size={18} strokeWidth={3} />
                                        Initialize Next Scan
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Telemetry Log */}
                <div className="w-full lg:w-96 bg-[#050505] border-l border-white/5 flex flex-col">
                    <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                            <Clock size={14} className="text-blue-500" />
                            Session Telemetry
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                        {scanHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                                <Zap size={40} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Terminal Idle</p>
                            </div>
                        ) : (
                            scanHistory.map((scan) => (
                                <motion.div 
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    key={scan.id} 
                                    className={`p-5 rounded-2xl border ${scan.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'} space-y-3`}
                                >
                                   <div className="flex justify-between items-center">
                                       <span className={`text-[10px] font-black uppercase tracking-widest ${scan.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                           {scan.status === 'success' ? 'Uplink Verified' : 'Block Encountered'}
                                       </span>
                                       <span className="text-[9px] font-black text-slate-700 font-mono">
                                           {scan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                       </span>
                                   </div>
                                   {scan.status === 'success' ? (
                                       <div className="space-y-1">
                                           <p className="text-xs font-bold text-white uppercase truncate">{scan.data.registrant.user_details.full_name}</p>
                                           <p className="text-[10px] font-bold text-slate-600 uppercase truncate tracking-tight">{scan.data.registrant.event_details.title}</p>
                                       </div>
                                   ) : (
                                       <p className="text-[10px] font-bold text-rose-500/50 uppercase tracking-widest">{scan.data.message}</p>
                                   )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminScanner;
