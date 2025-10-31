"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { skills } from "@/lib/data";
import { useApp } from "@/lib/contexts/AppContext";

export default function Skills() {
  const { lang } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="mt-12 p-9 rounded-xl border"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))",
        borderColor: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
      }}
      aria-label="Skills"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-[32px] font-bold mb-6"
        style={{ color: "var(--text)" }}
      >
        {lang === "en" ? "Skills" : "スキル"}
      </motion.h2>
      <div className="flex flex-wrap gap-5 mt-6">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{
              y: -3,
              boxShadow: "0 0 18px rgba(0, 246, 255, 0.4)",
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-250"
            style={{
              background: "rgba(0, 246, 255, 0.06)",
              borderColor: "rgba(0, 246, 255, 0.2)",
              boxShadow: "0 0 12px rgba(0, 246, 255, 0.08)",
            }}
            onHoverStart={(e) => {
              const target = e.target as HTMLElement;
              target.style.background =
                "linear-gradient(90deg, rgba(0, 246, 255, 0.1), rgba(255, 108, 251, 0.1))";
              target.style.borderColor = "rgba(255, 108, 251, 0.4)";
            }}
            onHoverEnd={(e) => {
              const target = e.target as HTMLElement;
              target.style.background = "rgba(0, 246, 255, 0.06)";
              target.style.borderColor = "rgba(0, 246, 255, 0.2)";
            }}
          >
            <Image
              src={skill.iconUrl}
              alt={`${skill.name} icon`}
              width={20}
              height={20}
              className="w-5 h-5"
              style={{
                filter: "brightness(1.2)",
              }}
              unoptimized
            />
            <span
              className="text-base font-semibold"
              style={{ color: "var(--text)" }}
            >
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
