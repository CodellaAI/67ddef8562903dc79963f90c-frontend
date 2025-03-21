
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'reddit-orange': '#FF4500',
        'reddit-dark': '#1A1A1B',
        'reddit-light-dark': '#272729',
        'reddit-border': '#343536',
        'reddit-muted': '#818384',
        'reddit-hover': '#2D2D2E',
      },
    },
  },
  plugins: [],
}
