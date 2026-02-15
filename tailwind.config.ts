import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#2D3436",
        "accent": "#1B263B",
        "university-gold": "#C5A059",
        "background-light": "#F8F9FA",
        "background-dark": "#0D1117",
      },
      fontFamily: {
        "display": ["var(--font-inter)", "sans-serif"],
        "heading": ["var(--font-barlow)", "sans-serif"],
        "academic": ["var(--font-playfair)", "serif"]
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
