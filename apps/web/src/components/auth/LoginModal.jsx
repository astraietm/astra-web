import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { X, Lock, Terminal, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const LoginModal = () => {
    const { isLoginModalOpen, setIsLoginModalOpen, handleServerLogin } = useAuth();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    if (!isLoginModalOpen) return null;

    const onGoogleSuccess = async (credentialResponse) => {
        setIsAuthenticating(true);
        try {
            // Send ID token to backend
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google/`, {
                token: credentialResponse.credential
            });
            
            // Artificial delay for effect
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            handleServerLogin(res.data);
            setIsAuthenticating(false);
        } catch (err) {
            console.error("Backend auth failed", err);
            setIsAuthenticating(false);
            // Alert user visually if backend is unreachable
            alert("Authentication server unreachable. Please try again later."); 
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => !isAuthenticating && setIsLoginModalOpen(false)}
                />

                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-8 text-center relative">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                        <div className="relative z-10">
                            <motion.div 
                                className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6"
                                animate={isAuthenticating ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: ["0 0 0 0px rgba(0, 255, 255, 0)", "0 0 0 10px rgba(0, 255, 255, 0.1)", "0 0 0 0px rgba(0, 255, 255, 0)"]
                                } : {}}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                {isAuthenticating ? (
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                ) : (
                                    <Lock className="w-8 h-8 text-primary" />
                                )}
                            </motion.div>
                            
                            <h2 className="text-2xl font-display font-bold text-white mb-2">
                                {isAuthenticating ? 'Verifying Identity...' : 'Authentication Required'}
                            </h2>
                            <p className="text-gray-400 text-sm mb-8 h-5">
                                {isAuthenticating ? 'Establishing secure uplink to ASTRA servers.' : 'Please identify yourself to access the network.'}
                            </p>

                            <div className="flex justify-center min-h-[40px]">
                                {isAuthenticating ? (
                                    <div className="flex items-center gap-2 text-primary font-mono text-sm tracking-wider">
                                        <ShieldCheck className="w-4 h-4" /> UPLINK ESTABLISHED
                                    </div>
                                ) : (
                                    <GoogleLogin
                                        onSuccess={onGoogleSuccess}
                                        onError={() => console.log('Login Failed')}
                                        theme="filled_black"
                                        shape="pill"
                                        size="large"
                                        width="240"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                                <Terminal className="w-3 h-3" />
                                Secured by ASTRA Network
                            </div>
                        </div>
                    </div>

                    {!isAuthenticating && (
                        <button 
                            onClick={() => setIsLoginModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default LoginModal;
