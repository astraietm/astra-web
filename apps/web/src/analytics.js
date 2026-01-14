import ReactGA from "react-ga4";

export const initGA = () => {
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!gaId) return;

  // Initialize strictly in production or if explicitly testing
  // FORCED ENABLE for debugging
  // if (import.meta.env.MODE === "production") {
    ReactGA.initialize(gaId);
    console.log("Analytics initialized in ALL MODES:", gaId);
  // } else {
  //   console.log("Analytics skipped (non-production mode)");
  // }
};

export const trackPageView = (path) => {
  if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: "pageview", page: path });
  }
};

export const trackEvent = ({ action, category, label, value }) => {
  if (import.meta.env.MODE === "production" && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.event({ action, category, label, value });
  }
};
