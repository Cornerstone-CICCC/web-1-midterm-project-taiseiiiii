"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { experience } from "@/lib/data";
import { useApp } from "@/lib/contexts/AppContext";

export default function Experience() {
  const { lang } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="mt-12 p-9 rounded-xl border"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))",
        borderColor: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
      }}
      aria-label="Experience"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-[32px] font-bold mb-6"
        style={{ color: "var(--text)" }}
      >
        {lang === "en" ? "Experience" : "職務経歴"}
      </motion.h2>
      <div className="relative pl-10 mt-6">
        <div
          className="absolute left-3 top-0 bottom-0 w-0.5"
          style={{
            background:
              "linear-gradient(180deg, var(--neon-cyan), var(--neon-pink))",
          }}
        />
        {experience.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ x: 8 }}
            className="relative mb-8 p-4 rounded-lg border transition-shadow duration-300"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
            onHoverStart={(e) => {
              const target = e.target as HTMLElement;
              target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
            }}
            onHoverEnd={(e) => {
              const target = e.target as HTMLElement;
              target.style.boxShadow = "none";
            }}
          >
            <div
              className="absolute -left-10 top-6 w-3 h-3 rounded-full"
              style={{
                background: "var(--neon-cyan)",
                boxShadow: "0 0 12px var(--neon-cyan)",
              }}
            />
            <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
              <h3
                className="font-bold text-xl flex-1"
                style={{ color: "var(--text)" }}
              >
                {item.company}
              </h3>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                style={{
                  background: "rgba(0, 246, 255, 0.1)",
                  color: "var(--neon-cyan)",
                  border: "1px solid rgba(0, 246, 255, 0.2)",
                }}
              >
                {item.year}
              </span>
            </div>
            <h3
              className="font-bold text-lg mb-1.5"
              style={{ color: "var(--text)" }}
            >
              {item.title[lang]}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {item.description[lang]}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
