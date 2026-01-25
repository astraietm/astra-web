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
        <div className="flex flex-col h-[calc(100vh-160px)] space-y-12">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Node Integrity Scanner</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Auth Station</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Verification Node</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Scanning real-time biometric and cryptographic node identifiers.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 p-4 rounded-3xl bg-white/[0.01] border border-white/[0.04]">
                     <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,1)] animate-pulse" />
                         Scanner_Online
                    </div>
                     <div className="h-8 w-px bg-white/[0.05]" />
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">FPS_STABLE</span>
                        <Terminal size={12} className="text-slate-700" />
                     </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-10 min-h-0">
                {/* Scanner Core Matrix */}
                <div className="flex-1 relative bg-white/[0.01] border border-white/[0.04] rounded-[3rem] overflow-hidden group flex flex-col items-center justify-center p-12">
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-blue-600/5 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </div>

                    <div className="relative w-full max-w-lg aspect-square rounded-[3.5rem] overflow-hidden border border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.5)] bg-black group/scanner transition-all duration-700 hover:border-blue-500/20">
                        {/* High-End HUD Corner Elements */}
                        <div className="absolute top-10 left-10 w-16 h-16 border-t-4 border-l-4 border-blue-600 z-20 rounded-tl-2xl opacity-40 group-hover/scanner:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-10 right-10 w-16 h-16 border-t-4 border-r-4 border-blue-600 z-20 rounded-tr-2xl opacity-40 group-hover/scanner:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-10 left-10 w-16 h-16 border-b-4 border-l-4 border-blue-600 z-20 rounded-bl-2xl opacity-40 group-hover/scanner:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-b-4 border-r-4 border-blue-600 z-20 rounded-br-2xl opacity-40 group-hover/scanner:opacity-100 transition-opacity duration-500" />
                        
                        {/* Dynamic HUD Grid */}
                        <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        
                        {isScanning && !scanResult && (
                            <div className="w-full h-full relative z-0">
                                <Scanner 
                                    onScan={handleScan}
                                    components={{ audio: false, finder: false }}
                                    styles={{ container: { width: '100%', height: '100%' } }}
                                />
                                {/* Laser Line Effect */}
                                <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-blue-500/30 to-transparent z-10 animate-scan pointer-events-none" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-10 pointer-events-none" />
                            </div>
                        )}

                        <AnimatePresence>
                            {isLoading && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-[#020202]/95 z-40 flex flex-col items-center justify-center space-y-6 backdrop-blur-3xl"
                                >
                                    <div className="relative">
                                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" strokeWidth={1.5} />
                                        <Zap className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">Decrypting Identity Handshake...</p>
                                        <p className="text-[8px] font-bold text-slate-700 uppercase tracking-widest">Protocol: ASTRA_V2.R8</p>
                                    </div>
                                </motion.div>
                            )}

                            {scanResult && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 1.1, blur: '10px' }}
                                    animate={{ opacity: 1, scale: 1, blur: '0px' }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute inset-0 z-50 bg-[#020202]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-14 text-center"
                                >
                                    {scanResult.status === 'success' ? (
                                        <motion.div initial={{ y: 30 }} animate={{ y: 0 }} className="w-full space-y-10">
                                            <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-500/5 border-2 border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.2)]">
                                                <CheckCircle className="w-14 h-14 text-emerald-500" strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-4">
                                                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">NODE_GRANTED</h2>
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] leading-none">Credentials Synchronized</p>
                                            </div>
                                            
                                            <div className="bg-white/[0.02] rounded-[2.5rem] p-10 border border-white/[0.05] space-y-8 text-left shadow-2xl relative overflow-hidden group/info active:scale-95 transition-transform">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-[40px]" />
                                                <div className="space-y-2 relative z-10">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block leading-none">Identified Asset</span>
                                                    <span className="text-2xl font-black text-white uppercase tracking-tight leading-none truncate block">
                                                        {scanResult.data.registrant.user_details.full_name || 'ROOT_AUTHORIZED'}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 relative z-10">
                                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block leading-none">Deployment Sector</span>
                                                    <span className="text-lg font-black text-blue-500 uppercase tracking-widest leading-none truncate block">
                                                        {scanResult.data.registrant.event_details.title}
                                                    </span>
                                                </div>
                                                {scanResult.data.registrant.team_name && (
                                                    <div className="pt-8 border-t border-white/[0.04] relative z-10">
                                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block leading-none mb-3">Squad Classification</span>
                                                        <div className="inline-flex px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs font-black text-purple-400 uppercase tracking-widest leading-none">
                                                            {scanResult.data.registrant.team_name}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div initial={{ y: 30 }} animate={{ y: 0 }} className="w-full space-y-10">
                                            <div className="w-28 h-28 rounded-[2.5rem] bg-rose-500/5 border-2 border-rose-500/20 flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(244,63,94,0.2)]">
                                                <XCircle className="w-14 h-14 text-rose-500" strokeWidth={1.5} />
                                            </div>
                                            <div className="space-y-4">
                                                <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">NODE_REJECTED</h2>
                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] leading-none">
                                                    {scanResult.data.message || "PROTOCOL_MISMATCH"}
                                                </p>
                                            </div>
                                            <div className="py-10 px-8 rounded-3xl bg-white/[0.01] border border-white/5 text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
                                                TERMINAL_ALERT: The provided cryptographic token failed internal verification checks. Access to the sector has been denied.
                                            </div>
                                        </motion.div>
                                    )}

                                    <button 
                                        onClick={resetScan}
                                        className="mt-12 w-full h-20 relative group"
                                    >
                                        <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative h-full w-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-3xl flex items-center justify-center gap-4 transition-all group-active:scale-95 border border-white/10 overflow-hidden">
                                            <Scan size={22} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                                            Initialize Next Sequence
                                        </div>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Telemetry Stream */}
                <div className="w-full lg:w-[450px] flex flex-col gap-8 h-full">
                    {/* Stats HUD */}
                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/[0.01] border border-white/[0.04] p-6 rounded-[2rem] space-y-2">
                             <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] block">Verified Nodes</span>
                             <span className="text-3xl font-black text-white uppercase tracking-tight font-mono">{scanHistory.filter(s=>s.status==='success').length}</span>
                         </div>
                         <div className="bg-white/[0.01] border border-white/[0.04] p-6 rounded-[2rem] space-y-2">
                             <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] block">Failed Uplinks</span>
                             <span className="text-3xl font-black text-rose-500 uppercase tracking-tight font-mono">{scanHistory.filter(s=>s.status!=='success').length}</span>
                         </div>
                    </div>

                    {/* History Layer */}
                    <div className="flex-1 bg-white/[0.01] border border-white/[0.04] rounded-[3rem] relative overflow-hidden flex flex-col min-h-0 shadow-2xl">
                        <div className="p-8 border-b border-white/[0.04] bg-black/40 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl">
                            <div className="flex items-center gap-4">
                                <History size={18} className="text-blue-500" />
                                <h3 className="text-xs font-black text-white uppercase tracking-widest">Protocol Stream</h3>
                            </div>
                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">SEQ_HISTORY</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {scanHistory.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 gap-6 py-24">
                                    <Cpu size={60} strokeWidth={1} />
                                    <div className="space-y-1 text-center">
                                         <p className="text-[10px] font-black uppercase tracking-[0.4em]">Terminal Standby</p>
                                         <p className="text-[8px] font-bold uppercase tracking-widest">Awaiting First Handshake</p>
                                    </div>
                                </div>
                            ) : (
                                scanHistory.map((scan) => (
                                    <motion.div 
                                        initial={{ x: 30, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        key={scan.id} 
                                        className={`p-6 rounded-3xl border ${scan.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'} space-y-5 group/item cursor-pointer hover:bg-white/[0.03] transition-all`}
                                    >
                                       <div className="flex justify-between items-center">
                                           <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${scan.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                               <div className={`w-1.5 h-1.5 rounded-full ${scan.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                               {scan.status === 'success' ? 'SYNC_VERIFIED' : 'SYNC_BLOCKED'}
                                           </div>
                                           <span className="text-[9px] font-black text-slate-700 font-mono tracking-widest">
                                               {scan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                           </span>
                                       </div>
                                       {scan.status === 'success' ? (
                                           <div className="space-y-1.5 pt-1">
                                               <p className="text-[13px] font-black text-white uppercase tracking-tight truncate leading-none group-hover/item:text-blue-400 transition-colors">{scan.data.registrant.user_details.full_name}</p>
                                               <p className="text-[9px] font-bold text-slate-600 uppercase truncate tracking-widest group-hover/item:text-slate-400 transition-colors">{scan.data.registrant.event_details.title}</p>
                                           </div>
                                       ) : (
                                           <div className="pt-1">
                                                <p className="text-[10px] font-black text-rose-500/80 uppercase tracking-[0.2em] leading-relaxed">{scan.data.message}</p>
                                           </div>
                                       )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                        <div className="p-8 border-t border-white/[0.04] bg-black/40 text-center">
                             <button className="text-[9px] font-black text-slate-700 uppercase tracking-widest hover:text-white transition-colors">Clear Stream Persistence</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminScanner;
