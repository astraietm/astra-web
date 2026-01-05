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
        <div className="min-h-screen bg-black text-white flex flex-col pt-20"> {/* PT-20 to clear Navbar if present */}
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0A0F1C]">
                <div>
                    <h1 className="text-xl font-display font-bold flex items-center gap-2">
                        <Scan className="w-6 h-6 text-primary" /> Admin Scanner
                    </h1>
                    <p className="text-xs text-gray-400 font-mono">ASTRA SECURITY PROTOCOL</p>
                </div>
                <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/20">
                    LIVE
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                
                {/* Scanner Viewport */}
                {isScanning && !scanResult && (
                    <div className="flex-1 relative bg-black">
                        <Scanner 
                            onScan={handleScan}
                            styles={{
                                container: { height: '100%', width: '100%' },
                                video: { objectFit: 'cover', height: '100%' }
                            }}
                            components={{
                                audio: false,
                                finder: false // Custom finder below
                            }}
                        />
                        {/* Custom Finder Overlay */}
                        <div className="absolute inset-0 border-[40px] border-black/60 z-10">
                            <div className="w-full h-full border-2 border-primary/50 relative">
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                                
                                {/* Scan Line Animation */}
                                <div className="absolute left-0 right-0 h-0.5 bg-primary/80 shadow-[0_0_15px_rgba(0,255,255,0.8)] animate-[scan_2s_linear_infinite] top-[10%]"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-10 left-0 right-0 text-center z-20">
                            <p className="text-sm font-mono bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-md">
                                Align QR Code within frame
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-bold animate-pulse">Verifying Token...</h2>
                    </div>
                )}

                {/* Result Modal - Success */}
                <AnimatePresence>
                    {scanResult?.status === 'success' && (
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="absolute inset-0 bg-[#051a05] z-50 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                                <CheckCircle className="w-12 h-12 text-black" />
                            </div>
                            <h2 className="text-4xl font-display font-bold text-green-500 mb-2">ACCESS GRANTED</h2>
                            <p className="text-green-300 text-lg mb-8">Verification Successful</p>
                            
                            <div className="bg-black/30 w-full max-w-sm rounded-xl p-6 border border-green-500/20 mb-8 space-y-4 text-left">
                                <div>
                                    <label className="text-xs text-green-500/60 uppercase font-mono">Attendee</label>
                                    <p className="text-xl font-bold text-white">
                                        {scanResult.data.registrant.user.name || "Unknown User"}
                                    </p>
                                    <p className="text-sm text-gray-400">{scanResult.data.registrant.user.email}</p>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div>
                                    <label className="text-xs text-green-500/60 uppercase font-mono">Event</label>
                                    <p className="text-lg font-bold text-white">
                                        {scanResult.data.registrant.event_details.title}
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={resetScan}
                                className="w-full max-w-xs bg-green-600 hover:bg-green-500 text-black font-bold py-4 rounded-xl text-lg transition-all"
                            >
                                SCAN NEXT
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result Modal - Failure */}
                <AnimatePresence>
                    {scanResult?.status === 'error' && (
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="absolute inset-0 bg-[#1a0505] z-50 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(220,38,38,0.4)]">
                                <XCircle className="w-12 h-12 text-black" />
                            </div>
                            <h2 className="text-4xl font-display font-bold text-red-500 mb-2">ACCESS DENIED</h2>
                            <p className="text-red-300 text-lg mb-8">
                                {scanResult.data.message || "Invalid or Corrupted Ticket"}
                            </p>

                             {/* If we have registrant details (e.g. reused ticket), show them */}
                             {scanResult.data.registrant && (
                                <div className="bg-black/30 w-full max-w-sm rounded-xl p-6 border border-red-500/20 mb-8 space-y-4 text-left opacity-75">
                                    <div className="flex items-center gap-2 text-red-400 mb-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Already Used By:</span>
                                    </div>
                                    <p className="text-xl font-bold text-white">
                                        {scanResult.data.registrant.user.name || "Unknown User"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Scanned at: {new Date(scanResult.data.registrant.updated_at).toLocaleTimeString()}
                                    </p>
                                </div>
                             )}

                            <button 
                                onClick={resetScan}
                                className="w-full max-w-xs bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl text-lg transition-all border border-white/10"
                            >
                                CANCEL / RETRY
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default AdminScanner;
