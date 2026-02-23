/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecfdf3",
          100: "#d1fadf",
          200: "#a6f4c5",
          300: "#4ade80",
          400: "#22c55e",
          500: "#16a34a",
          600: "#15803d",
          700: "#166534",
          800: "#14532d",
          900: "#052e16"
        },
        accent: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 118, 110, 0.08)"
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "1.75rem"
      },
      maxWidth: {
        "8xl": "96rem"
      }
    }
  },
  plugins: []
};
