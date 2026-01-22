/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      extend: {
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          // Legacy mappings for existing components
          surface: "#151921",
          'vision-bg': '#0B0F14',
          'vision-surface': '#151921',
          'vision-primary': '#6366F1',
          'vision-secondary': '#8B5CF6',
        },
        fontFamily: {
          sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
          display: ['Outfit', 'Inter', '-apple-system', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
        },
        backgroundImage: {
          'gradient-primary': 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          'vision-card': 'linear-gradient(127.09deg, rgba(21, 25, 33, 0.94) 19.41%, rgba(21, 25, 33, 0.49) 76.65%)',
          'vision-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
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
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
        },
        animation: {
          scan: 'scan 4s linear infinite',
          flicker: 'flicker 2s infinite',
          'scroll-left': 'scroll 20s linear infinite',
          shine: 'shine 1s',
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        }
      },
    },
    plugins: [
        require("tailwindcss-animate")
    ],
  }
