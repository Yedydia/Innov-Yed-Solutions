"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, [mounted]);

  const toggle = () => {};

  if (!mounted) return <>{children}</>;
  return <ThemeContext.Provider value={{ theme: "dark", toggle }}>{children}</ThemeContext.Provider>;
}
