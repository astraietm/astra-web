import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Maintenance from '../pages/Maintenance';
import { useAuth } from './AuthContext'; // To know if user is admin

const SystemContext = createContext();

export const useSystem = () => useContext(SystemContext);

export const SystemProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        registrationOpen: true,
        maintenanceMode: false,
    });
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth(); // We need to know if user is admin to bypass

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Public endpoint to get critical public settings (no auth required ideally, or minimal)
                // Since our previous backend view required Auth, we might need to adjust backend or try anyway
                // For now, let's assume we make a public endpoint or just fail gracefully 
                
                // ISSUE: Our current /ops/settings/ requires Admin Auth. 
                // We need a public endpoint to check maintenance mode status.
                // Let's create a specific public check or try to hit a new endpoint.
                
                // Temporary Solution: Try to fetch. If 401/403, usually means not admin.
                // But we need to know global maintenance state regardless of login for the *home* page.
                
                // Let's assume we will add a public endpoint for this.
                const response = await axios.get(`${API_URL}/ops/public-config/`);
                setSettings(prev => ({ ...prev, ...response.data }));
            } catch (error) {
                // If it fails (API down?), assume safe defaults (no maintenance)
                // or if specifically maintenance 503...
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Logic: If maintenance is ON, and user is NOT valid admin, show Maintenance Page.
    // However, user might be trying to log in via /admin.
    // So we should only block non-admin routes OR allow /admin path.
    
    // We handle this decision in the render below.
    
    const isMaintenanceActive = settings.maintenanceMode;
    const isAdmin = user?.is_staff;
    const isBypassing = isAdmin || window.location.pathname.startsWith('/admin');

    // If loading, we still render children to avoid white/black screen flash.
    // The defaults (registrationOpen: true, maintenanceMode: false) will be used until fetch completes.
    // if (loading || authLoading) {
    //    return null; 
    // }

    // Strict Maintenance Enforcement
    if (isMaintenanceActive && !isBypassing) {
         return <Maintenance />;
    }

    return (
        <SystemContext.Provider value={{ settings, setSettings }}>
            {children}
        </SystemContext.Provider>
    );
};
