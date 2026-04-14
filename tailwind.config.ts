import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B4332",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D4AF37",
          foreground: "#1A1A2E",
        },
        background: "#FAF7F2",
        surface: "#FFFFFF",
        foreground: "#1A1A2E",
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#C8E6C9",
          foreground: "#1B4332",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#1B4332",
      },
      fontFamily: {
        display: ["var(--font-amiri)", "serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
        urdu: ["var(--font-urdu)", "serif"],
      },
      borderRadius: {
        card: "8px",
        modal: "12px",
        pill: "9999px",
      },
      maxWidth: {
        content: "1280px",
      },
      spacing: {
        "section-mobile": "24px",
        "section-desktop": "48px",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 200ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
