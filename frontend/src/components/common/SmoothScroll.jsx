import { useEffect, useRef, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { useAnimationFrame } from 'framer-motion';

const ScrollContext = createContext({
    lenis: null
});

export const useLenis = () => useContext(ScrollContext);

const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // 1. Initialize Lenis (User's Exact Config)
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      smoothTouch: false
    });
    
    lenisRef.current = lenis;

    // 3. Cleanup
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 2. Framer Motion Integration (Drive Lenis with Framer's RAF)
  useAnimationFrame((time) => {
    lenisRef.current?.raf(time);
  });

  // 4. Reset Scroll on Route Change
  useEffect(() => {
    if (lenisRef.current) {
        // Immediate scroll to top to prevent visual jump
        lenisRef.current.scrollTo(0, { immediate: true });
    } else {
        window.scrollTo(0, 0); 
    }
  }, [location.pathname]);

  return (
    <ScrollContext.Provider value={{ lenis: lenisRef.current }}>
        {children}
    </ScrollContext.Provider>
  );
};

export default SmoothScroll;
