/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'arl-blue': '#0056b3',
        'arl-green': '#28a745',
        'arl-orange': '#fd7e14',
      }
    },
  },
  plugins: [],
}
