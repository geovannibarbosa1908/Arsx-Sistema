/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        arsx: {
          green: '#cc0000',
          'green-dark': '#7a0000',
          'green-light': '#e03333',
          dark: '#0a0a0a',
          card: '#111111',
          'card-2': '#1a1a1a',
          border: '#2a2a2a',
        },
      },
    },
  },
  plugins: [],
}
