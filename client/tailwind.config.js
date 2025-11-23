/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // Enable full default Tailwind theme including typography utilities
    presets: [require("tailwindcss/defaultConfig")],
  },
  plugins: [],
}