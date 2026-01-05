import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, XCircle, CheckCircle, Loader2, Scan, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminScanner = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null); // { status: 'success' | 'error', data: ... }
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Security Check: Only Staff/Admin
    useEffect(() => {
        if (!user && !token) {
            // Wait a bit to ensure auth load
            return;
        }
        if (user && !user.is_staff) {
            navigate('/'); // Kick non-admins out
        }
    }, [user, navigate, token]);

    // 2. Handle Scan
    const handleScan = async (detectedCodes) => {
        if (!isScanning || isLoading) return;
        
        const code = detectedCodes[0]?.rawValue;
        if (!code) return;

        // Debounce / Freeze scanner
        setIsScanning(false);
        setIsLoading(true);
        setError(null);

        // Extract token from URL if it's a full URL
        let tokenToVerify = code;
        if (code.includes('/verify/')) {
             // Handle "https://api.astraietm.in/verify/TOKEN/"
             tokenToVerify = code.split('/verify/')[1].replace('/', '');
        } 
        // Or if frontend URL "https://astraietm.in/ticket?token=..." (future proof)
        // For now, assume QR contains the TOKEN merely or endpoint.

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/verify/${tokenToVerify}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.valid) {
                setScanResult({ status: 'success', data: data });
            } else {
                setScanResult({ status: 'error', data: data });
            }
        } catch (err) {
            console.error("Verification failed", err);
            setScanResult({ 
                status: 'error', 
                data: { message: "Network Failed or Invalid QR Format" } 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setIsScanning(true);
    };

    if (!user || !user.is_staff) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">Access Restricted</div>;
    }

    return (
        <div className="min-h-[100dvh] bg-black text-white flex flex-col overflow-hidden fixed inset-0 z-[200]">
            
            {/* Mobile Optimized Header */}
            <div className="px-4 py-4 border-b border-white/10 flex justify-between items-center bg-[#0A0F1C] safe-top">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="p-2 -ml-2 hover:bg-white/5 rounded-full text-white/50 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold flex items-center gap-2">
                             Admin Scanner
                        </h1>
                        <p className="text-[10px] text-primary font-mono tracking-widest uppercase opacity-70">Astra Protocol v2.4</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                    LIVE
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative bg-black overflow-hidden">
                
                {/* Scanner Viewport */}
                {isScanning && !scanResult && (
                    <div className="absolute inset-0">
                        <Scanner 
                            onScan={handleScan}
                            constraints={{
                                facingMode: 'environment'
                            }}
                            styles={{
                                container: { height: '100%', width: '100%' },
                                video: { objectFit: 'cover', height: '100%', width: '100%' }
                            }}
                            components={{
                                audio: false,
                                finder: false
                            }}
                        />
                        {/* Responsive Finder Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            {/* Darkened mask */}
                            <div className="absolute inset-0 bg-black/40"></div>
                            
                            {/* Clear Scanning Area */}
                            <div className="w-[70vw] h-[70vw] max-w-[300px] max-h-[300px] relative bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                                
                                {/* Animated Scan Line */}
                                <motion.div 
                                    animate={{ top: ['10%', '90%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(0,255,255,0.8)] z-20"
                                />
                            </div>
                        </div>
                        
                        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20 px-6">
                            <p className="text-xs font-mono bg-black/80 text-white/70 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 text-center">
                                POSITION QR CODE IN THE CENTER
                            </p>
                        </div>
                    </div>
                )}

                {/* Verification Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-[60] backdrop-blur-sm">
                        <div className="relative">
                            <Loader2 className="w-16 h-16 text-primary animate-spin" />
                            <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse"></div>
                        </div>
                        <h2 className="mt-6 text-xl font-bold tracking-widest text-primary animate-pulse">ENCRYPTED VERIFICATION...</h2>
                        <p className="text-white/40 text-xs mt-2 font-mono">Querying Registration DB</p>
                    </div>
                )}

                {/* SUCCESS RESULT */}
                <AnimatePresence>
                    {scanResult?.status === 'success' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 bg-[#030712] z-[70] flex flex-col p-6 overflow-y-auto"
                        >
                            <div className="flex-1 flex flex-col items-center justify-center py-8">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(6,182,212,0.4)] relative z-10">
                                        <CheckCircle className="w-12 h-12 text-black" strokeWidth={3} />
                                    </div>
                                    <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150"></div>
                                </div>
                                
                                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Access Granted</h2>
                                <div className="h-1 w-20 bg-primary rounded-full mb-8"></div>
                                
                                <div className="w-full space-y-4">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10">
                                            <ShieldCheck size={64} />
                                        </div>
                                        <label className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1 block">Authorized Attendee</label>
                                        <p className="text-2xl font-bold text-white mb-1">{scanResult.data.registrant.user_name || "Unknown User"}</p>
                                        <p className="text-sm text-white/50 font-mono italic">{scanResult.data.registrant.user_email}</p>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                                        <label className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1 block">Mission/Event</label>
                                        <p className="text-lg font-bold text-white">{scanResult.data.registrant.event_details.title}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-white/40 font-mono">
                                            <Clock className="w-3 h-3" />
                                            Validated: {new Date().toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={resetScan}
                                className="w-full bg-primary text-black font-black py-5 rounded-2xl text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.3)] active:scale-[0.98] transition-all"
                            >
                                Scan Next Ticket
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ERROR RESULT */}
                <AnimatePresence>
                    {scanResult?.status === 'error' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 bg-[#030712] z-[70] flex flex-col p-6 overflow-y-auto"
                        >
                            <div className="flex-1 flex flex-col items-center justify-center py-8">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.4)] relative z-10">
                                        <XCircle className="w-12 h-12 text-black" strokeWidth={3} />
                                    </div>
                                    <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150"></div>
                                </div>
                                
                                <h2 className="text-3xl font-black text-red-500 mb-2 uppercase tracking-tighter">Access Denied</h2>
                                <p className="text-red-500/60 text-sm font-mono font-bold uppercase tracking-widest text-center px-4">
                                    {scanResult.data.message || "Invalid or Corrupted Signal"}
                                </p>

                                {scanResult.data.registrant && (
                                    <div className="w-full mt-8 space-y-4">
                                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 text-left opacity-80">
                                            <div className="flex items-center gap-2 text-red-400 mb-3">
                                                <AlertTriangle size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Security Alert: Duplicate Entry</span>
                                            </div>
                                            <p className="text-xl font-bold text-white mb-1">{scanResult.data.registrant.user_name || "Unknown User"}</p>
                                            <p className="text-xs text-white/40 font-mono mb-4 italic">{scanResult.data.registrant.user_email}</p>
                                            <div className="pt-4 border-t border-white/5 text-[10px] text-white/30 uppercase font-mono">
                                                Original Check-in: {new Date(scanResult.data.registrant.updated_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={resetScan}
                                className="w-full bg-white/10 text-white font-black py-5 rounded-2xl text-lg uppercase tracking-widest border border-white/20 active:scale-[0.98] transition-all"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default AdminScanner;
