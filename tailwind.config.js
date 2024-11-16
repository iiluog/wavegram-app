/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#E6E6E6',
        textPrimary: '#1D1D1D',
        textSecondary: '#5E5E5E',
        primary: '#1D1D1D',
        error: '#DC2626',
        success: '#059669',
        white: '#FFFFFF',
        border: '#gray-300',
      },
      spacing: {

      },
      zIndex: {
        'header': '50',
        'modal': '100',
      }
    },
  },
  plugins: [],
}