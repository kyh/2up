import type { Config } from "tailwindcss";

import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

const customPlugin = plugin(function ({ addVariant }) {
  addVariant("child", "& > *");
  addVariant("child-hover", "& > *:hover");
  addVariant("child-active", "& > *:active");
  addVariant("svg-path", "& path");
});

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        "purple-dark": "#2a194d",
        purple: "#7247C4",
        "purple-background": "#e1d8f3",
        white: "#FFFFFF",
        black: "#1A202C",
        "grey-background": "#EDF2F7",
        "grey-light": "#CBD5E0",
        grey: "#718096",
        "grey-dark": "#2D3748",
        red: "#f05252",
        yellow: "#ffca64",
        green: "#5cb85c",
      },
      screens: {
        desktop: "900px",
      },
      width: {
        sprite: "360px",
      },
      height: {
        sprite: "185px",
      },
      fontFamily: {
        sans: ["var(--font-chalkboard-se)", ...defaultTheme.fontFamily.sans],
        code: ["Consolas", "Monaco", "Andale Mono", "Ubuntu Mono", "monospace"],
      },
      borderRadius: {
        wavy: "30px 2px 30% 3px / 4px 10px 3px 30px",
      },
      keyframes: {
        "bounce-in": {
          "0%": {
            transform:
              "matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "3.4%": {
            transform:
              "matrix3d(0.316, 0, 0, 0, 0, 0.407, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "4.7%": {
            transform:
              "matrix3d(0.45, 0, 0, 0, 0, 0.599, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "6.81%": {
            transform:
              "matrix3d(0.659, 0, 0, 0, 0, 0.893, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "9.41%": {
            transform:
              "matrix3d(0.883, 0, 0, 0, 0, 1.168, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "10.21%": {
            transform:
              "matrix3d(0.942, 0, 0, 0, 0, 1.226, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "13.61%": {
            transform:
              "matrix3d(1.123, 0, 0, 0, 0, 1.332, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "14.11%": {
            transform:
              "matrix3d(1.141, 0, 0, 0, 0, 1.331, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "17.52%": {
            transform:
              "matrix3d(1.208, 0, 0, 0, 0, 1.239, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "18.72%": {
            transform:
              "matrix3d(1.212, 0, 0, 0, 0, 1.187, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "21.32%": {
            transform:
              "matrix3d(1.196, 0, 0, 0, 0, 1.069, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "24.32%": {
            transform:
              "matrix3d(1.151, 0, 0, 0, 0, 0.96, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "25.23%": {
            transform:
              "matrix3d(1.134, 0, 0, 0, 0, 0.938, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "29.03%": {
            transform:
              "matrix3d(1.063, 0, 0, 0, 0, 0.897, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "29.93%": {
            transform:
              "matrix3d(1.048, 0, 0, 0, 0, 0.899, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "35.54%": {
            transform:
              "matrix3d(0.979, 0, 0, 0, 0, 0.962, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "36.74%": {
            transform:
              "matrix3d(0.972, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "41.04%": {
            transform:
              "matrix3d(0.961, 0, 0, 0, 0, 1.022, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "44.44%": {
            transform:
              "matrix3d(0.966, 0, 0, 0, 0, 1.032, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "52.15%": {
            transform:
              "matrix3d(0.991, 0, 0, 0, 0, 1.006, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "59.86%": {
            transform:
              "matrix3d(1.006, 0, 0, 0, 0, 0.99, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "63.26%": {
            transform:
              "matrix3d(1.007, 0, 0, 0, 0, 0.992, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "75.28%": {
            transform:
              "matrix3d(1.001, 0, 0, 0, 0, 1.003, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "85.49%": {
            transform:
              "matrix3d(0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "90.69%": {
            transform:
              "matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "100%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
        },
        "bounce-out": {
          "0% ": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "3.4%": {
            transform:
              "matrix3d(0.968, 0, 0, 0, 0, 0.959, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "4.7%": {
            transform:
              "matrix3d(0.955, 0, 0, 0, 0, 0.94, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "6.81%": {
            transform:
              "matrix3d(0.934, 0, 0, 0, 0, 0.911, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "9.41%": {
            transform:
              "matrix3d(0.912, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "10.21%": {
            transform:
              "matrix3d(0.906, 0, 0, 0, 0, 0.877, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "13.61%": {
            transform:
              "matrix3d(0.888, 0, 0, 0, 0, 0.867, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "14.11%": {
            transform:
              "matrix3d(0.886, 0, 0, 0, 0, 0.867, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "17.52%": {
            transform:
              "matrix3d(0.879, 0, 0, 0, 0, 0.876, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "18.72%": {
            transform:
              "matrix3d(0.879, 0, 0, 0, 0, 0.881, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "21.32%": {
            transform:
              "matrix3d(0.88, 0, 0, 0, 0, 0.893, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "24.32%": {
            transform:
              "matrix3d(0.885, 0, 0, 0, 0, 0.904, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "25.23%": {
            transform:
              "matrix3d(0.887, 0, 0, 0, 0, 0.906, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "29.03%": {
            transform:
              "matrix3d(0.894, 0, 0, 0, 0, 0.91, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "29.93%": {
            transform:
              "matrix3d(0.895, 0, 0, 0, 0, 0.91, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "35.54%": {
            transform:
              "matrix3d(0.902, 0, 0, 0, 0, 0.904, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "36.74%": {
            transform:
              "matrix3d(0.903, 0, 0, 0, 0, 0.902, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "41.04%": {
            transform:
              "matrix3d(0.904, 0, 0, 0, 0, 0.898, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "44.44%": {
            transform:
              "matrix3d(0.903, 0, 0, 0, 0, 0.897, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "52.15%": {
            transform:
              "matrix3d(0.901, 0, 0, 0, 0, 0.899, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "59.86%": {
            transform:
              "matrix3d(0.899, 0, 0, 0, 0, 0.901, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "63.26%": {
            transform:
              "matrix3d(0.899, 0, 0, 0, 0, 0.901, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "75.28%": {
            transform:
              "matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "85.49%": {
            transform:
              "matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "90.69%": {
            transform:
              "matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "100% ": {
            transform:
              "matrix3d(0.9, 0, 0, 0, 0, 0.9, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
        },
        "bounce-expand": {
          "0%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "3.4%": {
            transform:
              "matrix3d(1.016, 0, 0, 0, 0, 1.02, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "4.7%": {
            transform:
              "matrix3d(1.022, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "6.81%": {
            transform:
              "matrix3d(1.033, 0, 0, 0, 0, 1.045, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "9.41%": {
            transform:
              "matrix3d(1.044, 0, 0, 0, 0, 1.058, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "10.21%": {
            transform:
              "matrix3d(1.047, 0, 0, 0, 0, 1.061, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "13.61%": {
            transform:
              "matrix3d(1.056, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "14.11%": {
            transform:
              "matrix3d(1.057, 0, 0, 0, 0, 1.067, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "17.52%": {
            transform:
              "matrix3d(1.06, 0, 0, 0, 0, 1.062, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "18.72%": {
            transform:
              "matrix3d(1.061, 0, 0, 0, 0, 1.059, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "21.32%": {
            transform:
              "matrix3d(1.06, 0, 0, 0, 0, 1.053, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "24.32%": {
            transform:
              "matrix3d(1.058, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "25.23%": {
            transform:
              "matrix3d(1.057, 0, 0, 0, 0, 1.047, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "29.03%": {
            transform:
              "matrix3d(1.053, 0, 0, 0, 0, 1.045, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "29.93%": {
            transform:
              "matrix3d(1.052, 0, 0, 0, 0, 1.045, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "35.54%": {
            transform:
              "matrix3d(1.049, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "36.74%": {
            transform:
              "matrix3d(1.049, 0, 0, 0, 0, 1.049, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "41.04%": {
            transform:
              "matrix3d(1.048, 0, 0, 0, 0, 1.051, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "44.44%": {
            transform:
              "matrix3d(1.048, 0, 0, 0, 0, 1.052, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "52.15%": {
            transform:
              "matrix3d(1.05, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "59.86%": {
            transform:
              "matrix3d(1.05, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "63.26%": {
            transform:
              "matrix3d(1.05, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "75.28%": {
            transform:
              "matrix3d(1.05, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "85.49%": {
            transform:
              "matrix3d(1.05, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "90.69%": {
            transform:
              "matrix3d(1.05, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "100%": {
            transform:
              "matrix3d(1.05, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
        },
        "bounce-contract": {
          "0%": {
            transform:
              "matrix3d(1.05, 0, 0, 0, 0, 1.05, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "3.4%": {
            transform:
              "matrix3d(1.034, 0, 0, 0, 0, 1.03, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "4.7%": {
            transform:
              "matrix3d(1.028, 0, 0, 0, 0, 1.02, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "6.81%": {
            transform:
              "matrix3d(1.017, 0, 0, 0, 0, 1.005, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "9.41%": {
            transform:
              "matrix3d(1.006, 0, 0, 0, 0, 0.992, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "10.21%": {
            transform:
              "matrix3d(1.003, 0, 0, 0, 0, 0.989, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "13.61%": {
            transform:
              "matrix3d(0.994, 0, 0, 0, 0, 0.983, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "14.11%": {
            transform:
              "matrix3d(0.993, 0, 0, 0, 0, 0.983, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "17.52%": {
            transform:
              "matrix3d(0.99, 0, 0, 0, 0, 0.988, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "18.72%": {
            transform:
              "matrix3d(0.989, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "21.32%": {
            transform:
              "matrix3d(0.99, 0, 0, 0, 0, 0.997, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "24.32%": {
            transform:
              "matrix3d(0.992, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "25.23%": {
            transform:
              "matrix3d(0.993, 0, 0, 0, 0, 1.003, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "29.03%": {
            transform:
              "matrix3d(0.997, 0, 0, 0, 0, 1.005, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "29.93%": {
            transform:
              "matrix3d(0.998, 0, 0, 0, 0, 1.005, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "35.54%": {
            transform:
              "matrix3d(1.001, 0, 0, 0, 0, 1.002, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "36.74%": {
            transform:
              "matrix3d(1.001, 0, 0, 0, 0, 1.001, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "41.04%": {
            transform:
              "matrix3d(1.002, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "44.44%": {
            transform:
              "matrix3d(1.002, 0, 0, 0, 0, 0.998, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "52.15%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "59.86%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "63.26%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "75.28%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "85.49%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "90.69%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
          "100%": {
            transform:
              "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)",
          },
        },
        visible: { to: { visibility: "visible" } },
        jitter: {
          "50%": { transform: "skewY(0.7deg) skewX(-0.7deg) scale(1.006)" },
        },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-up-in": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "draw-in": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        "bubble-explosion-3": { "100%": { backgroundPosition: "-6120px 0" } },
        "blinking-stars-2": { "100%": { backgroundPosition: "-10440px 0" } },
        "arrow-1": { "100%": { backgroundPosition: "-8280px 0" } },
        "wine-glass-clinking": { "100%": { backgroundPosition: "-18000px 0" } },
        "cross-mark": { "100%": { backgroundPosition: "-15840px 0" } },
        "check-mark": { "100%": { backgroundPosition: "-13320px 0" } },
        "bubble-empty": { "100%": { backgroundPosition: "-19080px 0" } },
        "bubble-dislike": { "100%": { backgroundPosition: "-17640px 0" } },
        "bubble-cry-emoji": { "100%": { backgroundPosition: "-17640px 0" } },
        "bubble-like": { "100%": { backgroundPosition: "-17640px 0" } },
        spinner: {
          from: { backgroundPosition: "40px 0" },
          to: { backgroundPosition: "0 0" },
        },
        "scale-animation": {
          "0%": { transform: "scaleX(1)" },
          "50%": { transform: "scaleX(0.95)" },
          "100%": { transform: "scaleX(1)" },
        },
        "eye-animation": {
          "0%": { transform: "translate(0)" },
          "50%": { transform: "translate(3px, 0)" },
          "100%": { transform: "translate(0)" },
        },
        "move-animation": {
          from: { transform: "translate(100vw)" },
          to: { transform: "translate(0vw)" },
        },
        "dust-animation": { "100%": { backgroundPositionX: "right" } },
      },
      animation: {
        "bubble-explosion-3": "bubble-explosion-3 1s steps(17) 1 forwards",
        "blinking-stars-2": "blinking-stars-2 1.2s steps(29) infinite forwards",
        "arrow-1": "arrow-1 1s steps(23) 1 forwards",
        "wine-glass-clinking": "wine-glass-clinking 1.5s steps(50) 1 forwards",
        "cross-mark": "cross-mark 1.4s steps(44) 1 forwards",
        "check-mark": "check-mark 1.3s steps(37) 1 forwards",
        "bubble-empty": "bubble-empty 1.5s steps(53) 1 forwards",
        "bubble-dislike": "bubble-dislike 1.5s steps(49) 1 forwards",
        "bubble-cry-emoji": "bubble-cry-emoji 1.5s steps(49) 1 forwards",
        "bubble-like": "bubble-like 1.5s steps(49) 1 forwards",
        dust: "dust-animation 1s steps(29) infinite forwards",
      },
      backgroundImage: {
        "bubble-explosion-3":
          "url('/sprites/bubble-explosion-03/spritesheet.png')",
        "blinking-stars-2": "url('/sprites/blinking-stars-02/spritesheet.png')",
        "arrow-1": "url('/sprites/arrow-1/spritesheet.png')",
        "wine-glass-clinking":
          "url('/sprites/wine-glass-clinking/spritesheet.png')",
        "cross-mark": "url('/sprites/cross-mark/spritesheet.png')",
        "check-mark": "url('/sprites/check-mark/spritesheet.png')",
        "bubble-empty": "url('/sprites/bubble-empty/spritesheet.png')",
        "bubble-dislike": "url('/sprites/bubble-dislike/spritesheet.png')",
        "bubble-cry-emoji": "url('/sprites/bubble-cry-emoji/spritesheet.png')",
        "bubble-like": "url('/sprites/bubble-like/spritesheet.png')",
        dust: "url('/sprites/dust.svg')",
        crown: "url('/illustrations/kitty-crown.svg')",
        glasses: "url('/illustrations/kitty-glasses.svg')",
        space: "url('/illustrations/space.svg')",
        "spinner-gradient-light":
          "linear-gradient(45deg, #2D3748 25%, transparent 25%, transparent 50%, #2D3748 50%, #2D3748 75%, transparent 75%, transparent)",
        "spinner-gradient-dark":
          "linear-gradient(45deg, #CBD5E0 25%, transparent 25%, transparent 50%, #CBD5E0 50%, #CBD5E0 75%, transparent 75%, transparent)",
      },
    },
  },
  plugins: [
    customPlugin,
    require("tailwind-scrollbar"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
