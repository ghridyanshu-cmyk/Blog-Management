import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    // 1. Check local storage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";

    // 2. If no saved theme, check system preference (Modern UX)
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <div className={dark ? "dark" : ""}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}