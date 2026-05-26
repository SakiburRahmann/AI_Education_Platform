"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  useEffect(() => {
    const saved = localStorage.getItem("eduai-theme") || "neutral";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
