import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';

import { SystemProvider } from './context/SystemContext';

// NOTE: In production, move this Client ID to .env
const GOOGLE_CLIENT_ID = "341883886940-vtbo7chmmlqpmc86bqgqbipfa4f495dn.apps.googleusercontent.com"; 

createRoot(document.getElementById('root')).render(
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
