"use client";

import { useState, useEffect, RefObject } from "react";

// Language hook
export type Language = "en" | "ja";

export function useLanguage() {
  const [lang, setLang] = useState<Language>("en");

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ja" : "en"));
  };

  return { lang, toggleLanguage };
}

// Theme hook
export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Check for saved theme preference or default to 'dark'
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      if (savedTheme === "light") {
        document.documentElement.classList.add("light");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);

    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  return { theme, toggleTheme };
}

// Intersection Observer hook for reveal animations
export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Once visible, stop observing
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

// Mouse position hook for 3D card effect
export function useMousePosition(ref: RefObject<HTMLElement>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    };

    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, [ref]);

  return position;
}

// Counter animation hook
export function useCounter(
  end: number,
  duration: number = 2000,
  start: number = 0
) {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const startCounter = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const currentCount = Math.floor(progress * (end - start) + start);

      setCount(currentCount);

      if (now >= endTime) {
        setCount(end);
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, 16); // ~60fps

    return () => clearInterval(timer);
  };

  return { count, startCounter, isAnimating };
}

// Typing animation hook
export function useTypingAnimation(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayText, isComplete };
}
