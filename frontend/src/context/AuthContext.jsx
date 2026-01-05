import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('jwt_access_token'));
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
                        is_staff: decoded.is_staff || false // Handle the is_staff claim
                    });
                }
            } catch (e) {
                logout();
            }
        }
    }, [token]);

    const handleServerLogin = (serverResponse) => {
        const { access, refresh, user } = serverResponse;
        setToken(access);
        setUser(user);
        localStorage.setItem('jwt_access_token', access);
        localStorage.setItem('jwt_refresh_token', refresh);
        setIsLoginModalOpen(false);

        if (pendingAction) {
            setPendingAction(null);
        }
    };

    const logout = () => {
        googleLogout();
        setToken(null);
        setUser(null);
        localStorage.removeItem('jwt_access_token');
        localStorage.removeItem('jwt_refresh_token');
    };

    const requireLogin = (action) => {
        if (user) {
            action.run();
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
            handleServerLogin, 
            logout,
            requireLogin,
            pendingAction
        }}>
            {children}
        </AuthContext.Provider>
    );
};
