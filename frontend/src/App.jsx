import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Events from './pages/Events';
import Register from './pages/Register';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import AdminScanner from './pages/AdminScanner';
import AdminDashboard from './pages/AdminDashboard';
import AdminRegistrations from './pages/AdminRegistrations';
import AdminEvents from './pages/AdminEvents';
import AdminGallery from './pages/AdminGallery';
import AdminPlaceholder from './pages/AdminPlaceholder';
import ScrollToTop from './components/common/ScrollToTop';
import SmoothScroll from './components/common/SmoothScroll';
import InitialBootLoader from './components/common/InitialBootLoader';
import LoginModal from './components/auth/LoginModal';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <AnimatePresence>
        {loading && (
          <InitialBootLoader key="boot-loader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <ScrollToTop />
          <LoginModal /> {/* Global Login Modal */}
          <SmoothScroll>
            <Routes>
              {/* ADMIN SCANNER ROUTE (Outside Layouts for Fullscreen) */}
              <Route path="/admin/scanner" element={<AdminScanner />} />

              {/* NEW ADMIN CONSOLE LAYOUT */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="registrations" element={<AdminRegistrations />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="blog" element={<AdminPlaceholder title="Blog Manager" />} />
                <Route path="notifications" element={<AdminPlaceholder title="Notification Dispatcher" />} />
                <Route path="logs" element={<AdminPlaceholder title="Security Logs" />} />
                <Route path="settings" element={<AdminPlaceholder title="System Settings" />} />
              </Route>

              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="events" element={<Events />} />
                <Route path="register/:id" element={<Register />} />
                <Route path="my-registrations" element={<Dashboard />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="about" element={<About />} />
                <Route path="blog" element={<Blog />} />
                <Route path="contact" element={<Contact />} />
              </Route>
            </Routes>
          </SmoothScroll>
        </>
      )}
    </Router>
  );
}

export default App;
