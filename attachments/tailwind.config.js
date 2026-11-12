/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        ink: "#081423",
        ink2: "#0C1C2E",
        ink3: "#12283F",
        clay: { DEFAULT: "#C15F3C", hi: "#D97D5A", lo: "#A44C2C" },
        cream: "#F7F6F3",
        sand: "#EFEBE4",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        sans: ["Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
