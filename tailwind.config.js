/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sube: {
          orange: "#ff8200",
          "orange-dark": "#e67600",
        }
      },
    },
  },
  plugins: [],
}
