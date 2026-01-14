import ReactGA from "react-ga4";

export const initGA = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  // Initialize only if ID exists
  // In a real production scenario, you might also want to check if import.meta.env.PROD is true
  if (gaId) {
    ReactGA.initialize(gaId);
  }
};

export const trackPageView = (path) => {
  // Send pageview only if initialized
  if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: "pageview", page: path });
  }
};
