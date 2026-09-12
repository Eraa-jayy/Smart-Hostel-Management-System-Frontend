const defaultTheme = require("tailwindcss/defaultTheme");

const uniNestPalette = {
  50: "#FFFFFF",
  100: "#F4F5FF",
  200: "#D8DBF7",
  300: "#A9AFE8",
  400: "#6871C7",
  500: "#212880",
  600: "#212880",
  700: "#1A2066",
  800: "#161A54",
  900: "#111440",
  950: "#111440",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: uniNestPalette,
        indigo: uniNestPalette,
        violet: uniNestPalette,
        purple: uniNestPalette,
        orange: uniNestPalette,
        amber: uniNestPalette,
        emerald: uniNestPalette,
        teal: uniNestPalette,
        green: uniNestPalette,
        red: uniNestPalette,
        gray: uniNestPalette,
        slate: uniNestPalette,
        brand: uniNestPalette,
        gold: "#BDA664",
      },
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
