import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwt_access_token'));
    const [loading, setLoading] = useState(true);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null); 

    // Init: Check for existing token
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    // Populate user from token claims
                    setUser({
                        email: decoded.email,
                        name: decoded.full_name,
                        avatar: decoded.avatar,
                        is_staff: decoded.is_staff || false
                    });
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const handleServerLogin = (serverResponse) => {
        const { access, refresh, user } = serverResponse;
        setToken(access);
        setUser(user);
        localStorage.setItem('jwt_access_token', access);
        localStorage.setItem('jwt_refresh_token', refresh);
        setIsLoginModalOpen(false);

        if (pendingAction) {
            // Check if profile is complete (Phone & College)
            if (!user.phone_number || !user.college) {
                // Open Profile Modal, keep pendingAction to run after profile update
                setIsProfileModalOpen(true);
            } else {
                // Execute directly
                pendingAction.run(access);
                setPendingAction(null);
            }
        }
    };

    const logout = () => {
        googleLogout();
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwt_access_token');
        localStorage.removeItem('jwt_refresh_token');
    };

    // Global Axios Interceptor for 401s
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    const requireLogin = (action) => {
        if (user) {
            // Check Profile Completeness even if already logged in
            if (!user.phone_number || !user.college) {
                setPendingAction(action);
                setIsProfileModalOpen(true);
            } else {
                action.run(token);
            }
        } else {
            setPendingAction(action);
            setIsLoginModalOpen(true);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isLoginModalOpen, 
            setIsLoginModalOpen,
            isProfileModalOpen,
            setIsProfileModalOpen,
            updateUser: (updates) => {
                const normalizedUpdates = { ...updates };
                if (updates.full_name && !updates.name) normalizedUpdates.name = updates.full_name;
                if (updates.name && !updates.full_name) normalizedUpdates.full_name = updates.name;
                setUser(prev => ({ ...prev, ...normalizedUpdates }));
            }, 
            handleServerLogin, 
            logout,
            requireLogin,
            pendingAction,
            setPendingAction,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
