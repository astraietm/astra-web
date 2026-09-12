'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { X, Lock, Loader2, ShieldCheck } from 'lucide-react';
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
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => !isAuthenticating && setIsLoginModalOpen(false)}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white border-2 border-black shadow-[6px_6px_0px_#000] overflow-hidden"
        >
          <div className="p-8 text-center relative">
            <div className="relative z-10">
              <motion.div
                className="w-16 h-16 bg-[#F0F0FA] border-2 border-black flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0px_#000]"
                animate={
                  isAuthenticating
                    ? {
                        scale: [1, 1.05, 1],
                        borderColor: ['#000', '#F79CFF', '#000'],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {isAuthenticating ? (
                  <Loader2 className="w-8 h-8 text-black animate-spin" />
                ) : (
                  <Lock className="w-8 h-8 text-black" />
                )}
              </motion.div>

              <h2 className="font-pixel text-xl font-bold uppercase text-black mb-2">
                {isAuthenticating ? 'VERIFYING...' : 'SIGN IN'}
              </h2>
              <p className="font-sans text-sm text-gray-600 mb-8">
                {isAuthenticating
                  ? 'Establishing secure connection to ASTRA servers.'
                  : 'Authenticate to access event registration and more.'}
              </p>

              <div className="flex justify-center min-h-[44px]">
                {isAuthenticating ? (
                  <div className="flex items-center gap-2 font-mono text-sm text-emerald-700 font-bold">
                    <ShieldCheck className="w-4 h-4" /> LINK ESTABLISHED
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => console.log('Login Failed')}
                    theme="outline"
                    shape="rectangular"
                    size="large"
                    width="280"
                  />
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-black/10 relative z-10">
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" />
                Secured by ASTRA Network
              </div>
            </div>
          </div>

          {!isAuthenticating && (
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-black transition-colors z-20"
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
