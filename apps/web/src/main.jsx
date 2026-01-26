import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Self-hosted fonts for better performance
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/700.css';
import '@fontsource/rajdhani/400.css';
import '@fontsource/rajdhani/700.css';

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { SystemProvider } from './context/SystemContext';

// Client ID loaded from .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Handle Vite dynamic import errors
window.addEventListener('vite:preloadError', (event) => {
  console.log('Detected chunk loading error. Reloading site...');
  window.location.reload();
});

const Root = () => {
  useEffect(() => {
    // Hide initial loader when React app is ready
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500);
    }
  }, []);

  return (
    <StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <SystemProvider>
            <App />
          </SystemProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </StrictMode>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<Root />);
