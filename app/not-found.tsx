"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PixelPet from "./components/PixelPet";
import { useApp } from "@/lib/contexts/AppContext";

const messages = {
  en: [
    "Oops! Even Slime doesn't know this page...",
    "Are you lost? Let's go home together!",
    "404...? That's a strange number~",
    "There's nothing here! Let's go back home!",
  ],
  ja: [
    "あれれ？ このページ、スライムも知らないみたい…",
    "迷子になっちゃったかな？ ぼくと一緒に帰ろう！",
    "404…？ なんだか難しい数字だね～",
    "ここには何もないみたい！ お家に戻ろうよ！",
  ],
};

const buttonText = {
  en: "Go Home",
  ja: "お家に帰る",
};

export default function NotFound() {
  const { lang, theme } = useApp();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages[lang].length);
    }, 4000);
    return () => clearInterval(messageInterval);
  }, [lang]);

  const isDark = theme === "dark";
  const bgGradient = isDark
    ? "bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#0f0f0f]"
    : "bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const mutedTextColor = isDark ? "text-gray-400" : "text-gray-600";
  const bubbleBg = isDark
    ? "from-[#0f0f0f] to-[#1a1a1a]"
    : "from-white to-gray-50";
  const bubbleBorder = isDark ? "border-cyan-400/40" : "border-cyan-500/50";
  const bubbleShadow = isDark
    ? "shadow-[0_0_20px_rgba(0,255,255,0.3)]"
    : "shadow-[0_0_20px_rgba(0,180,216,0.2)]";

  return (
    <div
      className={`relative flex flex-col items-center justify-center min-h-screen ${bgGradient} ${textColor} overflow-hidden px-4`}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`w-full h-full ${
            isDark ? "opacity-10" : "opacity-20"
          } bg-[radial-gradient(circle_at_30%_40%,#0ff,transparent_60%)]`}
        />
        <div
          className={`absolute top-20 left-20 w-40 h-40 ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-400/20"
          } rounded-full blur-3xl`}
        />
        <div
          className={`absolute bottom-20 right-20 w-60 h-60 ${
            isDark ? "bg-pink-500/10" : "bg-pink-400/20"
          } rounded-full blur-3xl`}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <h1 className="text-7xl md:text-9xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,255,0.6)] animate-pulse">
          404
        </h1>
        <p
          className={`text-center ${mutedTextColor} mt-2 text-sm md:text-base`}
        >
          Page Not Found
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12"
      >
        <div className="relative">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
            className={`relative bg-gradient-to-br ${bubbleBg} border-2 ${bubbleBorder} px-6 py-4 rounded-2xl text-base md:text-lg ${
              isDark ? "text-gray-200" : "text-gray-800"
            } ${bubbleShadow} max-w-xs md:max-w-md backdrop-blur-sm`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <p>{messages[lang][messageIndex]}</p>
            </div>
          </motion.div>
          <div className="md:hidden">
            <div
              className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[16px] border-l-transparent border-r-transparent ${
                isDark ? "border-t-cyan-400/40" : "border-t-cyan-500/50"
              }`}
            />
            <div
              className={`absolute -bottom-[14px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[14px] border-l-transparent border-r-transparent ${
                isDark ? "border-t-[#0f0f0f]" : "border-t-white"
              }`}
            />
          </div>
          <div className="hidden md:block">
            <div
              className={`absolute -right-4 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[16px] border-b-[16px] border-l-[16px] border-t-transparent border-b-transparent ${
                isDark ? "border-l-cyan-400/40" : "border-l-cyan-500/50"
              }`}
            />
            <div
              className={`absolute -right-[14px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[14px] border-b-[14px] border-l-[14px] border-t-transparent border-b-transparent ${
                isDark ? "border-l-[#0f0f0f]" : "border-l-white"
              }`}
            />
          </div>
        </div>
        <div className="relative w-32 h-32 flex items-center justify-center">
          <PixelPet size={100} bounceHeight={15} isFixed={false} />
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className={`${mutedTextColor} text-sm mb-8 text-center max-w-md px-4`}
      >
        💡{" "}
        {lang === "en" ? "Click the slime!" : "スライムをクリックしてみてね！"}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link
          href="/"
          className={`group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold ${
            isDark ? "text-black" : "text-white"
          } bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 overflow-hidden`}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-2">
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {buttonText[lang]}
          </span>
        </Link>
      </motion.div>
      <div
        className={`absolute top-20 right-10 ${
          isDark ? "opacity-20" : "opacity-30"
        } animate-bounce hidden md:block`}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full blur-sm" />
      </div>
      <div
        className={`absolute bottom-32 left-10 ${
          isDark ? "opacity-20" : "opacity-30"
        } animate-bounce hidden md:block`}
        style={{ animationDelay: "1s" }}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full blur-sm" />
      </div>
    </div>
  );
}
