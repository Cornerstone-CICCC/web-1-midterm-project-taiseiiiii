"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ParticleBackground from "./components/ParticleBackground";
import CursorTrail from "./components/CursorTrail";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Works from "./components/Works";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import Blog from "./components/Blog";
import LoadingAnimation from "./components/LoadingAnimation";
import PixelPet from "./components/PixelPet";

export default function Home() {
  const [lang, setLang] = useState<"en" | "ja">("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ja" : "en"));
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <LoadingAnimation />

      <ParticleBackground theme={theme} />
      <CursorTrail count={5} speed={0.25} size={12} maxOpacity={0.2} />

      <div className="relative z-10">
        <div className="container mx-auto px-6 lg:px-9 max-w-[1100px]">
          <Header
            lang={lang}
            theme={theme}
            onLanguageToggle={toggleLanguage}
            onThemeToggle={toggleTheme}
          />

          <main>
            <Hero lang={lang} />
            <Experience lang={lang} />
            <Skills lang={lang} />
            <Works lang={lang} />
            <Blog lang={lang} />
            <Contact lang={lang} />
          </main>
          <Footer />
        </div>
      </div>
      <PixelPet />
    </>
  );
}
