/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        plaxo: {
          background: '#0F172A',
          surface: '#1E293B',
          border: '#334155',
          primary: '#A3E635',
          'primary-hover': '#84CC16',
          text: '#F8FAFC',
          'text-secondary': '#CBD5E1',
          error: '#EF4444',
          success: '#22C55E',
          warning: '#EAB308',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 16px rgba(0,0,0,0.3)',
        focus: '0 0 0 2px #A3E635',
      },
    },
  },
  plugins: [],
}