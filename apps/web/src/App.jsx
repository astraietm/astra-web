import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import LoginModal from './components/auth/LoginModal';
import CompleteProfileModal from './components/auth/CompleteProfileModal';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import CustomCursor from './components/common/CustomCursor';
import SmoothScroll from './components/common/SmoothScroll';

// Lazy Load Pages for Performance
const Home = React.lazy(() => import('./pages/Home'));
const Events = React.lazy(() => import('./pages/Events'));
const EventDetail = React.lazy(() => import('./pages/EventDetail'));
const Register = React.lazy(() => import('./pages/Register'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const ShippingPolicy = React.lazy(() => import('./pages/ShippingPolicy'));

// Admin Lazy Loading
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminRegistrations = React.lazy(() => import('./pages/AdminRegistrations'));
const AdminEvents = React.lazy(() => import('./pages/AdminEvents'));
const AdminGallery = React.lazy(() => import('./pages/AdminGallery'));
const AdminScanner = React.lazy(() => import('./pages/AdminScanner'));
const AdminNotifications = React.lazy(() => import('./pages/AdminNotifications'));
const AdminLogs = React.lazy(() => import('./pages/AdminLogs'));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from './analytics';

function AnalyticsTracker() {
  const location = useLocation();

  React.useEffect(() => {
    initGA();
  }, []);

  React.useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

// Minimal Loading Fallback
const PageLoader = () => (
  <div className="min-h-[60vh] w-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest animate-pulse">Loading Asset...</p>
    </div>
  </div>
);

function App() {
  React.useEffect(() => {
    // Warm up and Keep Alive logic for Render cold starts
    const pingBackend = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        if (API_URL) {
           // We use the health endpoint for a lightweight check
           await fetch(`${API_URL}/health/`);
        }
      } catch (e) {
        // Silent failure is fine
      }
    };

    // Initial warm up call
    pingBackend();

    // Keep-alive interval: Ping every 5 minutes to prevent spindown (Render timeout is 15m)
    const interval = setInterval(pingBackend, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <AnalyticsTracker />
          <Analytics />
          <SpeedInsights />

          <ScrollToTop />
          <LoginModal />
          <CompleteProfileModal />

          <Suspense fallback={<PageLoader />}>
            <SmoothScroll>
              <Routes>
                {/* ADMIN ROUTES */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="registrations" element={<AdminRegistrations />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="scanner" element={<AdminScanner />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="logs" element={<AdminLogs />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* PUBLIC ROUTES */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/:id" element={<EventDetail />} />
                  <Route path="register/:id" element={<Register />} />
                  <Route path="my-registrations" element={<Dashboard />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="terms" element={<TermsAndConditions />} />
                  <Route path="refund-policy" element={<RefundPolicy />} />
                  <Route path="shipping-policy" element={<ShippingPolicy />} />
                  <Route path="privacy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </SmoothScroll>
          </Suspense>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
