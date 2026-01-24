import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';

import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';

import { SystemProvider } from './context/SystemContext';

// Client ID loaded from .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

// Handle Vite dynamic import errors (Common during new deployments)
window.addEventListener('vite:preloadError', (event) => {
  console.log('Detected chunk loading error. Reloading site...');
  window.location.reload();
});

const root = createRoot(document.getElementById('root'));


root.render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <SystemProvider>
          <App />
        </SystemProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
