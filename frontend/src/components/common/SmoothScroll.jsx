import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    });
    
    lenisRef.current = lenis;

    // 2. Animation Loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 3. Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 4. Reset Scroll on Route Change
  useEffect(() => {
    if (lenisRef.current) {
        // Immediate scroll to top to prevent visual jump
        lenisRef.current.scrollTo(0, { immediate: true });
    } else {
        // Fallback if Lenis isn't ready
        window.scrollTo(0, 0); 
    }
  }, [location.pathname]);

  return children;
};

export default SmoothScroll;
