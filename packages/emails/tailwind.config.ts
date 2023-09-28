import type { Config } from "tailwindcss";
import sharedConfig from "configs/tailwind/tailwind.config";

const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}"],
  presets: [sharedConfig],
};

export default config;
