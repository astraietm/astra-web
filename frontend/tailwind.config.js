/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00FF9D", // Neon Green
        secondary: "#1A1A1A", // Dark Gray
        background: "#050505", // Very Dark Black
        surface: "#121212", // Slightly lighter for cards
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(to right, #00FF9D, #00D1FF)',
      }
    },
  },
  plugins: [],
}
