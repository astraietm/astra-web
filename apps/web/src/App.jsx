import React from 'react';
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

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <AnalyticsTracker />
          <Analytics />
          <SpeedInsights />

          {/* <CustomCursor /> */}
          <ScrollToTop />
          <LoginModal /> {/* Global Login Modal */}
          <CompleteProfileModal /> {/* Global Complete Profile Modal */}
          {/* <SmoothScroll> */}
          <Routes>
            {/* NEW ADMIN CONSOLE LAYOUT */}
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

              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          {/* </SmoothScroll> */}
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
