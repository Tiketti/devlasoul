/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Grandmaster Clash"', "system-ui", "sans-serif"],
        grandmaster: ['"Grandmaster Clash"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: ["@tailwindcss/postcss"],
};
