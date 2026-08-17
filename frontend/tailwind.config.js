/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        arsx: {
          DEFAULT: '#cc0000',
          dark: '#7a0000',
          light: '#e03333',
          bg: '#0a0a0a',
          card: '#111111',
          border: '#2a2a2a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
