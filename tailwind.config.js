/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          950: '#07070c',
          900: '#0d0d14',
          800: '#14141f',
          700: '#1e1e2e',
        },
        accent: {
          primary: '#38bdf8',
          secondary: '#818cf8',
        }
      }
    },
  },
  plugins: [],
}
