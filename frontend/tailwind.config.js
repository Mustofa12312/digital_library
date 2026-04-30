/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005F02',
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#005F02',
          950: '#003d01',
        },
        secondary: {
          DEFAULT: '#427A43',
          light: '#5a9c5c',
          dark: '#2d5c2e',
        },
        accent: {
          DEFAULT: '#C0B87A',
          light: '#d4ce9e',
          dark: '#a09a52',
        },
        background: {
          DEFAULT: '#F2E3BB',
          dark: '#e8d4a0',
          card: '#faf6ee',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 95, 2, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 95, 2, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
