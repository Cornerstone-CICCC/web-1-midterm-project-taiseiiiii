"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Language = "en" | "ja";
export type Theme = "dark" | "light";

interface AppContextType {
  lang: Language;
  theme: Theme;
  toggleLanguage: () => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [lang, setLang] = useState<Language>("en");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (typeof window !== undefined) {
      const storedLang = window.localStorage.getItem("lang");
      const storedTheme = window.localStorage.getItem("theme");

      if (storedLang === "en" || storedLang === "ja") {
        setLang(storedLang);
      } else {
        const userLang = navigator.language.toLowerCase();
        if (userLang.startsWith("ja")) {
          setLang("ja");
        } else {
          setLang("en");
        }
      }

      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      } else {
        setTheme("dark");
      }
    }
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => {
      const newLang = prev === "en" ? "ja" : "en";
      window.localStorage.setItem("lang", newLang);
      return newLang;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem("theme", newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  const value: AppContextType = {
    lang,
    theme,
    toggleLanguage,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
