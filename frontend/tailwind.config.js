/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#1a2a4a",
          dark: "#0f1c30",
          blue: "#1e3a5f",
          lightBlue: "#e8eff7",
          border: "#cbd5e1",
          orange: "#fd9638",
          orangeHover: "#e5852e",
          green: "#0d824d",
          red: "#c5221f",
          gray: "#f4f6f9"
        },
        aicte: {
          maroon: "#7b1113",
          navy: "#13294b",
          gold: "#d4af37",
          accent: "#ff9933",
          light: "#fffdf9"
        }
      },
      fontFamily: {
        heading: ["Roboto Condensed", "sans-serif"],
        serif: ["PT Serif", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    },
  },
  plugins: [],
}
