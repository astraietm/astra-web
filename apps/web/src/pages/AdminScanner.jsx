import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, XCircle, CheckCircle, Loader2, Scan, AlertTriangle, ArrowLeft, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminScanner = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null); // { status: 'success' | 'error', data: ... }
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    
    // Recent scans log
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

        // Parse Token
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
            setScanHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10
            
            // Auto close success after 3 seconds for rapid scanning
            if (data.valid) {
                // setTimeout(resetScan, 3000);
            }

        } catch (err) {
            console.error("Verification failed", err);
            setScanResult({ 
                status: 'error', 
                data: { message: "Network Uplink Failed" },
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
        <div className="flex flex-col h-[calc(100vh-64px)] bg-black overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            {/* Header */}
            <div className="relative z-10 px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md flex justify-between items-center">
                <div>
                     <h1 className="text-xl font-black text-white tracking-wider uppercase flex items-center gap-2 font-display">
                         <Scan className="text-primary w-5 h-5 animate-pulse" />
                         Security_Terminal_V1
                    </h1>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-primary/80 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    LIVE UPLINK
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative z-10">
                {/* Scanner Section */}
                <div className="flex-1 relative flex flex-col items-center justify-center p-6 border-r border-white/10 bg-[#050505]">
                    
                    {/* Scanner Frame */}
                    <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] group">
                        
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary z-20 rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary z-20 rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary z-20 rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary z-20 rounded-br-xl" />

                        {isScanning && !scanResult && (
                            <>
                                <Scanner 
                                    onScan={handleScan}
                                    components={{ audio: false, finder: false }}
                                    styles={{ container: { width: '100%', height: '100%' } }}
                                />
                                {/* Scanning Laser Animation */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] z-30 animate-[scan_2s_linear_infinite]" />
                                <div className="absolute inset-0 bg-primary/5 z-10 animate-pulse" />
                            </>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center">
                                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                                <p className="text-primary font-mono tracking-widest text-sm animate-pulse">DECRYPTING PROTOCOL...</p>
                            </div>
                        )}

                        {/* Result Overlay */}
                        <AnimatePresence>
                            {scanResult && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-8 text-center"
                                >
                                    {scanResult.status === 'success' ? (
                                        <>
                                            <div className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                                                <CheckCircle className="w-12 h-12 text-green-500" />
                                            </div>
                                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Access Granted</h2>
                                            <p className="text-green-400 font-mono text-sm mb-6 uppercase tracking-widest">Identity Verified</p>
                                            
                                            <div className="bg-white/5 rounded-xl p-4 w-full border border-white/10 mb-6 space-y-2">
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block text-xs uppercase mb-1">Pass Holder</span>
                                                    <span className="text-white font-bold text-lg">{scanResult.data.registrant.user_details.full_name || scanResult.data.registrant.user_details.email}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block text-xs uppercase mb-1">Event Protocol</span>
                                                    <span className="text-primary font-mono">{scanResult.data.registrant.event_details.title}</span>
                                                </div>
                                                {scanResult.data.registrant.team_name && (
                                                    <div className="text-sm pt-2 border-t border-white/10 mt-2">
                                                        <span className="text-gray-500 block text-xs uppercase mb-1">Team Unit</span>
                                                        <span className="text-purple-400 font-bold">{scanResult.data.registrant.team_name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-24 h-24 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                                                <XCircle className="w-12 h-12 text-red-500" />
                                            </div>
                                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Access Denied</h2>
                                            <p className="text-red-400 font-mono text-sm mb-6 uppercase tracking-widest">{scanResult.data.message || "Invalid Token"}</p>
                                        </>
                                    )}

                                    <button 
                                        onClick={resetScan}
                                        className="w-full py-4 bg-white text-black font-black uppercase tracking-wider rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
                                    >
                                        <Scan className="w-5 h-5" />
                                        Scan Next Target
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar Log - Hidden on mobile if needed, or stacked */}
                <div className="w-full md:w-96 bg-[#0A0A0A] border-l border-white/10 flex flex-col z-20">
                     <div className="p-4 border-b border-white/10 bg-white/5">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Activity Log
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {scanHistory.length === 0 ? (
                            <div className="text-center py-10 opacity-30">
                                <Zap className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-xs font-mono uppercase">System Idle</p>
                            </div>
                        ) : (
                            scanHistory.map((scan) => (
                                <div key={scan.id} className={`p-4 rounded-xl border ${scan.status === 'success' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'} flex items-start gap-4 animate-in fade-in slide-in-from-right duration-300`}>
                                   <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${scan.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                                   <div className="flex-1 min-w-0">
                                       <div className="flex justify-between items-start mb-1">
                                            <p className={`text-sm font-bold ${scan.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                                {scan.status === 'success' ? 'VERIFIED' : 'REJECTED'}
                                            </p>
                                            <span className="text-[10px] text-gray-600 font-mono">
                                                {scan.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                                            </span>
                                       </div>
                                       {scan.status === 'success' ? (
                                           <div className="text-xs text-gray-400 space-y-0.5">
                                               <p className="truncate text-white">{scan.data.registrant.user_details.full_name}</p>
                                               <p className="opacity-50 truncate">{scan.data.registrant.event_details.title}</p>
                                           </div>
                                       ) : (
                                           <p className="text-xs text-gray-500">{scan.data.message}</p>
                                       )}
                                   </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminScanner;
