import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
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
import AdminEvents from './pages/AdminEvents';
import ScrollToTop from './components/common/ScrollToTop';
import SmoothScroll from './components/common/SmoothScroll';
import InitialBootLoader from './components/common/InitialBootLoader';
import LoginModal from './components/auth/LoginModal';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <Analytics />
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
              {/* ADMIN SCANNER ROUTE (Outside MainLayout for Fullscreen) */}
              <Route path="/admin/scanner" element={<AdminScanner />} />

              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="events" element={<Events />} />
                <Route path="register/:id" element={<Register />} />
                <Route path="my-registrations" element={<Dashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/events" element={<AdminEvents />} />
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
