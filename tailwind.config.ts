import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <-- Hada huwa s-sarout lli kan naqes!
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",       // Royal Blue
        secondary: "#10B981",     // Emerald Green
        accent: "#F97316",        // Orange
        neutral: {
          bg: "var(--color-neutral-bg)",           // <-- Daba wlla dynamic!
          "bg-alt": "var(--color-neutral-bg-alt)", // <-- Daba wlla dynamic!
        },
        text: {
          dark: "var(--color-text-dark)",          // <-- Daba wlla dynamic!
          muted: "var(--color-text-muted)",        // <-- Daba wlla dynamic!
        },
        border: {
          custom: "var(--color-border-custom)",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        marquee: "marquee 35s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }, // <-- Hada huwa s-sarout d spatial loop!
        },
      },
    },
  },
  plugins: [],
};

export default config;