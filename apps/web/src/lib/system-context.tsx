'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

interface SystemSettings {
  registrationOpen: boolean;
  maintenanceMode: boolean;
  [key: string]: any;
}

interface SystemContextType {
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  isMaintenanceActive: boolean;
}

const SystemContext = createContext<SystemContextType | null>(null);

export const useSystem = () => {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used within SystemProvider');
  return ctx;
};

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>({
    registrationOpen: true,
    maintenanceMode: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/ops/public-config/');
        setSettings((prev) => ({ ...prev, ...response.data }));
      } catch {
        // If API is down, use safe defaults
      }
    };
    fetchSettings();
  }, []);

  const isMaintenanceActive = settings.maintenanceMode === true;

  return (
    <SystemContext.Provider value={{ settings, setSettings, isMaintenanceActive }}>
      {children}
    </SystemContext.Provider>
  );
};
