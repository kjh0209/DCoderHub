"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    try {
      useStore.persist?.rehydrate?.();
    } catch {
      // persist not available in this env
    }
    useStore.getState().initializeData();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
