/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          dark: "#121212"
        }
      }
    }
  },
  plugins: []
}
