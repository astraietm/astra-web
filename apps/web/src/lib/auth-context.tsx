'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import api, { API_URL } from './api';

export interface User {
  email: string;
  name: string;
  full_name?: string;
  avatar: string;
  role: string;
  is_staff: boolean;
  phone_number: string;
  college: string;
  usn: string;
}

interface PendingAction {
  label?: string;
  run: (token: string) => void;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  handleServerLogin: (data: { access: string; refresh: string; user: User }) => void;
  logout: () => void;
  requireLogin: (action: PendingAction) => void;
  updateUser: (updates: Partial<User>) => void;
  pendingAction: PendingAction | null;
  setPendingAction: (action: PendingAction | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const initializedRef = useRef(false);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_access_token');
      localStorage.removeItem('jwt_refresh_token');
    }
  }, []);

  // Listen for forced logout from API interceptor
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  // Init: check for existing token
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initAuth = async () => {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('jwt_access_token') : null;
      if (savedToken) {
        try {
          const decoded: any = jwtDecode(savedToken);
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setToken(savedToken);
            // Set basic info from JWT claims
            setUser({
              email: decoded.email,
              name: decoded.full_name || '',
              full_name: decoded.full_name || '',
              avatar: decoded.avatar || '',
              role: decoded.role || 'USER',
              is_staff: decoded.is_staff || false,
              phone_number: decoded.phone_number || '',
              college: decoded.college || '',
              usn: decoded.usn || '',
            });

            // Fetch fresh profile from API
            try {
              const res = await api.get('/api/auth/me/');
              setUser({
                ...res.data,
                name: res.data.full_name,
              });
            } catch (err: any) {
              if (err.response?.status === 401) logout();
            }
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const handleServerLogin = useCallback(
    (data: { access: string; refresh: string; user: User }) => {
      const { access, refresh, user: userData } = data;
      setToken(access);
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_access_token', access);
        localStorage.setItem('jwt_refresh_token', refresh);
      }
      setIsLoginModalOpen(false);

      if (pendingAction) {
        if (!userData.phone_number || !userData.college) {
          setIsProfileModalOpen(true);
        } else {
          pendingAction.run(access);
          setPendingAction(null);
        }
      }
    },
    [pendingAction]
  );

  const requireLogin = useCallback(
    (action: PendingAction) => {
      if (user) {
        if (!user.phone_number || !user.college) {
          setPendingAction(action);
          setIsProfileModalOpen(true);
        } else if (token) {
          action.run(token);
        }
      } else {
        setPendingAction(action);
        setIsLoginModalOpen(true);
      }
    },
    [user, token]
  );

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) =>
      prev
        ? {
            ...prev,
            ...updates,
            name: updates.full_name || updates.name || prev.name,
            full_name: updates.full_name || updates.name || prev.full_name,
          }
        : null
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        handleServerLogin,
        logout,
        requireLogin,
        updateUser,
        pendingAction,
        setPendingAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
