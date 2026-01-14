import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import InitialBootLoader from './components/common/InitialBootLoader';
import LoginModal from './components/auth/LoginModal';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import CustomCursor from './components/common/CustomCursor';

// Lazy Load Pages for Performance
const Home = React.lazy(() => import('./pages/Home'));
const Events = React.lazy(() => import('./pages/Events'));
const EventDetail = React.lazy(() => import('./pages/EventDetail'));
const Register = React.lazy(() => import('./pages/Register'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

// Admin Lazy Loading
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminRegistrations = React.lazy(() => import('./pages/AdminRegistrations'));
const AdminEvents = React.lazy(() => import('./pages/AdminEvents'));
const AdminGallery = React.lazy(() => import('./pages/AdminGallery'));
const AdminScanner = React.lazy(() => import('./pages/AdminScanner'));
const AdminNotifications = React.lazy(() => import('./pages/AdminNotifications'));
const AdminLogs = React.lazy(() => import('./pages/AdminLogs'));
const AdminSettings = React.lazy(() => import('./pages/AdminSettings'));

function App() {
  const [loading, setLoading] = useState(false); // Loader disabled

  const handleBootComplete = () => {
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Analytics />
          <SpeedInsights />
          <AnimatePresence>
            {loading && (
              <InitialBootLoader key="boot-loader" onComplete={handleBootComplete} />
            )}
          </AnimatePresence>

          {!loading && (
            <>
              <CustomCursor />
              <ScrollToTop />
              <LoginModal /> {/* Global Login Modal */}
              {/* <SmoothScroll> */}
                <Routes>
                  {/* NEW ADMIN CONSOLE LAYOUT */}
                  <Route path="/admin" element={
                    <React.Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-black text-neon-green">Initializing Core...</div>}>
                      <AdminLayout />
                    </React.Suspense>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="registrations" element={<AdminRegistrations />} />
                    <Route path="events" element={<AdminEvents />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="scanner" element={<AdminScanner />} />

                    <Route path="notifications" element={<AdminNotifications />} />
                    <Route path="logs" element={<AdminLogs />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  <Route path="/" element={
                    <React.Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-black text-neon-green font-mono tracking-widest animate-pulse">LOADING...</div>}>
                      <MainLayout />
                    </React.Suspense>
                  }>
                    <Route index element={<Home />} />
                    <Route path="events" element={<Events />} />
                    <Route path="events/:id" element={<EventDetail />} />
                    <Route path="register/:id" element={<Register />} />
                    <Route path="my-registrations" element={<Dashboard />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="about" element={<About />} />

                    <Route path="contact" element={<Contact />} />
                  </Route>
                </Routes>
              {/* </SmoothScroll> */}
            </>
          )}
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
