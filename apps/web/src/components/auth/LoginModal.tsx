'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { X, Lock, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, handleServerLogin } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  if (!isLoginModalOpen) return null;

  const onGoogleSuccess = async (credentialResponse: any) => {
    setIsAuthenticating(true);
    try {
      const res = await api.post('/api/auth/google/', {
        token: credentialResponse.credential,
      });
      await new Promise((resolve) => setTimeout(resolve, 800));
      handleServerLogin(res.data);
      setIsAuthenticating(false);
    } catch (err) {
      console.error('Backend auth failed', err);
      setIsAuthenticating(false);
      alert('Authentication server unreachable. Please try again later.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={() => !isAuthenticating && setIsLoginModalOpen(false)}
        />

        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-white rounded-3xl border border-neutral-200/80 shadow-2xl overflow-hidden font-sans"
        >
          <div className="p-8 text-center relative">
            <div className="relative z-10">
              <motion.div
                className="w-14 h-14 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-center mx-auto mb-5 shadow-sm text-neutral-900"
                animate={
                  isAuthenticating
                    ? {
                        scale: [1, 1.05, 1],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isAuthenticating ? (
                  <Loader2 className="w-6 h-6 text-neutral-900 animate-spin" />
                ) : (
                  <Lock className="w-6 h-6 text-neutral-800" />
                )}
              </motion.div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/60 text-[11px] font-medium text-neutral-600 mb-3">
                <Sparkles className="w-3 h-3 text-neutral-800" />
                <span>ASTRA 2026 Authentication</span>
              </div>

              <h2 className="text-xl font-bold text-neutral-950 tracking-tight mb-2">
                {isAuthenticating ? 'Verifying Account...' : 'Welcome to ASTRA'}
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed mb-6">
                {isAuthenticating
                  ? 'Establishing secure session token with ASTRA identity servers.'
                  : 'Sign in with your Google account to access registrations and your event pass.'}
              </p>

              <div className="flex justify-center min-h-[44px] items-center">
                {isAuthenticating ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-4 h-4" /> Secure Link Established
                  </div>
                ) : (
                  <div className="scale-95 origin-center">
                    <GoogleLogin
                      onSuccess={onGoogleSuccess}
                      onError={() => console.log('Login Failed')}
                      theme="outline"
                      shape="pill"
                      size="large"
                      width="260"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 relative z-10">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                Secured by KMCT &amp; ASTRA Network
              </div>
            </div>
          </div>

          {!isAuthenticating && (
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors z-20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LoginModal;
