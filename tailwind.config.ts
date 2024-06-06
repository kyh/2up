import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)"],
        mono: ["var(--font-carbon)"],
      },
      colors: {
        normal: {
          DEFAULT: "#fff",
          hover: "#e7e7e7",
          text: "#222",
          outline: "#adafbc",
          shadow: "#b3b3b9",
          border: "#222",
        },
        primary: {
          DEFAULT: "#209cee",
          hover: "#108de0",
          text: "#fff",
          outline: "#108de060",
          shadow: "#006bb3",
          border: "#222",
        },
        success: {
          DEFAULT: "#92cc41",
          hover: "#76c442",
          text: "#fff",
          outline: "#76c44260",
          shadow: "#4aa52e",
          border: "#222",
        },
        warning: {
          DEFAULT: "#f7d51d",
          hover: "#f2c409",
          text: "#222",
          outline: "#f2c40960",
          shadow: "#e59400",
          border: "#222",
        },
        error: {
          DEFAULT: "#e76e55",
          hover: "#ce372b",
          text: "#fff",
          outline: "#ce372b60",
          shadow: "#8c2022",
          border: "#222",
        },
        disabled: {
          DEFAULT: "#d3d3d3",
          hover: "#d3d3d3",
          text: "#afb0b2",
          outline: "#fff",
          shadow: "#adafbc",
          border: "#7a7c7f",
        },
        dark: {
          DEFAULT: "#222",
          111: "#111",
          333: "#333",
          444: "#444",
          555: "#555",
          666: "#666",
          777: "#777",
          888: "#888",
          999: "#999",
        },
        light: "#fff",
      },
    },
  },
  plugins: [],
};
export default config;
