/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00E0FF", // Neon Cyan/Blue
        secondary: "#1A1E29", // Dark Blue-Gray
        background: "#02040a", // Deep Blue Black
        surface: "#0A0F1C", // Slightly lighter for cards
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(to right, #00E0FF, #0066FF)',
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
      },
      animation: {
        scan: 'scan 4s linear infinite',
        flicker: 'flicker 2s infinite',
        'scroll-left': 'scroll 20s linear infinite',
      }
    },
  },
  plugins: [],
}
