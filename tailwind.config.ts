import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        "dark-bg": "#070707",
        "dark-panel": "#0f0f10",
        "dark-text": "#e6eef6",
        "dark-muted": "#8b98a8",
        // Light mode colors
        "light-bg": "#f8f9fa",
        "light-panel": "#ffffff",
        "light-text": "#212529",
        "light-muted": "#6c757d",
        // Neon colors
        "neon-cyan": {
          DEFAULT: "#00f6ff",
          light: "#0099ff",
        },
        "neon-pink": {
          DEFAULT: "#ff6cfb",
          light: "#e91e63",
        },
      },
      backgroundImage: {
        "gradient-neon":
          "linear-gradient(90deg, var(--neon-cyan), var(--neon-pink))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 246, 255, 0.5)",
        "neon-pink": "0 0 20px rgba(255, 108, 251, 0.5)",
        "accent-glow":
          "0 6px 30px rgba(0, 246, 255, 0.06), 0 2px 6px rgba(255, 108, 251, 0.03)",
        "accent-glow-light":
          "0 6px 30px rgba(0, 153, 255, 0.1), 0 2px 6px rgba(233, 30, 99, 0.05)",
      },
      animation: {
        "gradient-shift": "gradientShift 15s ease infinite",
        blink: "blink 1s steps(2, start) infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
        },
        blink: {
          "50%": { borderColor: "transparent" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
