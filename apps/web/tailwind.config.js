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
        anton: ['var(--font-anton)', 'Anton', 'sans-serif'],
        display: ['var(--font-anton)', 'Anton', 'var(--font-display)', 'Bebas Neue', 'sans-serif'],
        serif: ['var(--font-serif)', 'Instrument Serif', 'Georgia', 'serif'],
        editorial: ['var(--font-serif)', 'Instrument Serif', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'General Sans', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'General Sans', 'system-ui', 'sans-serif'],
        pixel: ['var(--font-pixel)', 'SF Pixelate', 'monospace'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'none': 'none',
        'brutal-sm': 'none',
        'brutal': 'none',
        'brutal-lg': 'none',
        'brutal-xl': 'none',
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
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
