"use client";

import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {children}
  </NextThemeProvider>
);

export const useTheme = () => {
  return useNextTheme();
};
