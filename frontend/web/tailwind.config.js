/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'alibaba-red': '#00a14b',
        'alibaba-dark': '#1F2937',
      }
    },
  },
  plugins: [],
}
