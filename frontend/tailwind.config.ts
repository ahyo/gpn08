import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe0e2',
          200: '#ffc6ca',
          300: '#ff9da4',
          400: '#fc646f',
          500: '#f43545',
          600: '#e01729',
          700: '#bc0f1f',
          800: '#9b101d',
          900: '#81141f',
          950: '#47040b',
        },
        navy: {
          50: '#f2f6fc',
          100: '#e2ebf8',
          200: '#cbdcf3',
          300: '#a7c5ea',
          400: '#7ca6de',
          500: '#5d88d4',
          600: '#496dc7',
          700: '#3f5bb6',
          800: '#394c94',
          900: '#0e2a52',
          950: '#071a36',
        },
        gold: {
          400: '#f5c451',
          500: '#e8ad2a',
          600: '#c88a15',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,26,54,0.04), 0 8px 24px -12px rgba(7,26,54,0.18)',
        lift: '0 2px 4px rgba(7,26,54,0.05), 0 24px 48px -24px rgba(7,26,54,0.35)',
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(14,42,82,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,42,82,0.06) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '80%,100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22,1,0.36,1) infinite',
        marquee: 'marquee 38s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
