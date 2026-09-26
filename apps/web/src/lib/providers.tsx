'use client';

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
import { AuthProvider } from '@/lib/auth-context';
import { SystemProvider } from '@/lib/system-context';
import { ToastProvider } from '@/lib/toast-context';
import LoginModal from '@/components/auth/LoginModal';
import CompleteProfileModal from '@/components/auth/CompleteProfileModal';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <SystemProvider>
            <ToastProvider>
              {children}
              <LoginModal />
              <CompleteProfileModal />
            </ToastProvider>
          </SystemProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ReactLenis>
  );
};
