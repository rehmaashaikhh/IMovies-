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
        // Custom Warm Bronze & Deep Mahogany Palette: #5B3113 and #B08F7A
        primary: {
          DEFAULT: '#5B3113',
          hover: '#733e18',
          glow: 'rgba(91, 49, 19, 0.45)',
          50: '#fdf8f5',
          100: '#f9eee8',
          200: '#f2dad0',
          300: '#e5bfb0',
          400: '#d49d8a',
          500: '#B08F7A',
          600: '#8f5636',
          700: '#733e18',
          800: '#5B3113',
          900: '#3d200c',
        },
        dark: {
          DEFAULT: '#09090b',
          900: '#000000',
          800: '#121216',
          700: '#18181f',
          600: '#272730',
        },
        card: '#121216',
        accent: {
          DEFAULT: '#B08F7A',
          hover: '#c5a794',
          glow: 'rgba(176, 143, 122, 0.45)',
        },

        // Unified Cinema Classes Mapped to #5B3113 and #B08F7A
        prime: {
          darkest: '#000000',
          dark: '#0a0a0a',
          surface: '#121216',
          card: '#121216',
          cardHover: '#1c1c24',
          border: '#27272a',
          blue: '#5B3113',
          blueHover: '#733e18',
          blueDark: '#3d200c',
          gold: '#B08F7A',
          muted: '#a1a1aa',
        },
        cinema: {
          darkest: '#000000',
          dark: '#0a0a0a',
          surface: '#121216',
          card: '#121216',
          border: '#27272a',
          red: '#5B3113',
          redHover: '#733e18',
          gold: '#B08F7A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-prime': '0 0 25px -4px rgba(91, 49, 19, 0.55)',
        'glow-cyan': '0 0 20px -3px rgba(176, 143, 122, 0.45)',
        'glow-orange': '0 0 25px -4px rgba(91, 49, 19, 0.55)',
        'glow-green': '0 0 25px -4px rgba(91, 49, 19, 0.55)',
        'glow-gold': '0 0 20px -3px rgba(176, 143, 122, 0.45)',
        'orange-glow': '0 0 25px rgba(91, 49, 19, 0.45)',
        'orange-sm': '0 0 12px rgba(176, 143, 122, 0.35)',
        'nvidia-glow': '0 0 25px rgba(91, 49, 19, 0.55)',
      }
    },
  },
  plugins: [],
}
