/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // Subtle Indigo
        secondary: "#8B5CF6", // Soft Violet
        accent: "#3B82F6", // Professional Blue
        background: "#0B0F14", // Neutral Dark Graphite
        surface: "#151921", // Card Surface
        border: "#1F2937", // Subtle Border
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%': { opacity: '0.02' },
          '5%': { opacity: '0.05' },
          '10%': { opacity: '0.02' },
          '15%': { opacity: '0.05' },
          '20%': { opacity: '0.02' },
          '50%': { opacity: '0.02' },
          '55%': { opacity: '0.05' },
          '60%': { opacity: '0.02' },
          '100%': { opacity: '0.02' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shine: {
          '100%': { left: '125%' },
        },
      },
      animation: {
        scan: 'scan 4s linear infinite',
        flicker: 'flicker 2s infinite',
        'scroll-left': 'scroll 20s linear infinite',
        shine: 'shine 1s',
      }
    },
  },
  plugins: [],
}
