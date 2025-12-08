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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        gov: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#22c55e',
            500: '#16a34a',
            600: '#15803d',
            700: '#166534',
            800: '#14532d',
            900: '#052e16',
            dark: '#1a3a2a',
            darker: '#0f2318',
            light: '#22c55e',
          },
          saffron: '#ff9933',
          white: '#ffffff',
        },
        sidebar: {
          bg: '#1a3a2a',
          hover: '#234d38',
          active: '#22c55e',
          text: '#d1fae5',
          muted: '#6ee7b7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}