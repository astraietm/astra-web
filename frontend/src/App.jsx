import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ScrollToTop from './components/common/ScrollToTop';
import SmoothScroll from './components/common/SmoothScroll';
import InitialBootLoader from './components/common/InitialBootLoader';

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
          <SmoothScroll>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="events" element={<Events />} />
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
