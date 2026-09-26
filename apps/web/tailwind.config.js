/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        border: 'var(--color-border)',

        /* TinkerHub Sticker Palette */
        'th-pink': 'var(--color-pink)',
        'th-yellow': 'var(--color-yellow)',
        'th-lime': 'var(--color-lime)',
        'th-mint': 'var(--color-mint)',
        'th-lilac': 'var(--color-lilac)',
        'th-sky': 'var(--color-sky)',
        'th-cream': 'var(--color-cream)',
        'th-gold': 'var(--color-gold)',

        /* Admin Panel Colors */
        'admin-bg': '#090A0F',
        'admin-surface': '#111318',
        'admin-border': '#1e2028',
        'admin-accent': '#3b82f6',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Anton', 'Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'General Sans', 'Inter', 'system-ui', 'sans-serif'],
        general: ['var(--font-general)', 'General Sans', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        editorial: ['var(--font-editorial)', 'Instrument Serif', 'Georgia', 'serif'],
        pixel: ['var(--font-pixel)', 'SF Pixelate', 'Pixelify Sans', 'Courier New', 'monospace'],
        anton: ['var(--font-anton)', 'Anton', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px var(--color-shadow, #000)',
        'brutal': '4px 4px 0px 0px var(--color-shadow, #000)',
        'brutal-lg': '8px 8px 0px 0px var(--color-shadow, #000)',
        'brutal-xl': '12px 12px 0px 0px var(--color-shadow, #000)',
      },
      borderWidth: {
        '3': '3px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-fast': 'marquee 15s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      }
    },
  },
  plugins: [],
}
