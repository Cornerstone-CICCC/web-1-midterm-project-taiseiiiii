"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navigation } from "@/lib/data";
import { useApp } from "@/lib/contexts/AppContext";

export default function Header() {
  const { lang, theme, toggleLanguage, toggleTheme } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`
        sticky top-0 z-50 
        flex items-center justify-between
        px-4 py-3
        transition-all duration-300
        ${
          isScrolled
            ? "bg-dark-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg shadow-accent-glow"
            : "bg-transparent"
        }
      `}
    >
      {/* Logo */}
      <motion.div
        className="text-lg font-bold tracking-wide"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        taisei.dev
      </motion.div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-5" aria-label="primary">
        {navigation.map((item) => (
          <motion.button
            key={item.href}
            onClick={() => scrollToSection(item.href)}
            className="
              text-sm font-semibold text-dark-muted dark:text-dark-muted
              px-3 py-2 rounded-md
              transition-all duration-200
              hover:text-neon-cyan hover:bg-neon-cyan/5
            "
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.label[lang]}
          </motion.button>
        ))}
      </nav>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <motion.button
          onClick={toggleLanguage}
          className="
            w-9 h-9 rounded-lg
            border border-white/10 bg-white/5
            flex items-center justify-center
            text-dark-muted dark:text-dark-muted
            transition-all duration-200
            hover:text-neon-cyan hover:border-neon-cyan/30
            hover:shadow-neon-cyan
          "
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={lang === "en" ? "Switch to Japanese" : "英語に切り替え"}
          aria-label="Toggle language"
        >
          🌐
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="
            w-9 h-9 rounded-lg
            border border-white/10 bg-white/5
            flex items-center justify-center
            text-dark-muted dark:text-dark-muted
            transition-all duration-200
            hover:text-neon-cyan hover:border-neon-cyan/30
            hover:shadow-neon-cyan
          "
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </motion.button>

        {/* Mobile Menu Toggle */}
        <motion.button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="
            md:hidden w-9 h-9 rounded-lg
            border border-white/10 bg-white/5
            flex flex-col items-center justify-center gap-1
            text-dark-muted dark:text-dark-muted
            transition-all duration-200
            hover:text-neon-cyan hover:border-neon-cyan/30
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle mobile menu"
        >
          <motion.span
            animate={{
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 4 : 0,
            }}
            className="w-5 h-0.5 bg-current rounded-full"
          />
          <motion.span
            animate={{
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
            className="w-5 h-0.5 bg-current rounded-full"
          />
          <motion.span
            animate={{
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -4 : 0,
            }}
            className="w-5 h-0.5 bg-current rounded-full"
          />
        </motion.button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="
              absolute top-full left-0 right-0 mt-2
              md:hidden
              bg-dark-panel/95 dark:bg-dark-panel/95
              backdrop-blur-lg
              rounded-xl
              border border-white/10
              shadow-accent-glow
              overflow-hidden
            "
          >
            <div className="flex flex-col p-4 gap-2">
              {navigation.map((item, index) => (
                <motion.button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="
                    text-left text-sm font-semibold
                    text-dark-muted dark:text-dark-muted
                    px-4 py-3 rounded-lg
                    transition-all duration-200
                    hover:text-neon-cyan hover:bg-neon-cyan/5
                  "
                >
                  {item.label[lang]}
                </motion.button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
