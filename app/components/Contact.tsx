"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { personalInfo } from "@/lib/data";

interface ContactProps {
  lang: "en" | "ja";
}

export default function Contact({ lang }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const contactLinks = [
    {
      icon: "📧",
      label: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: "💼",
      label: "LinkedIn",
      href: personalInfo.linkedin,
    },
    {
      icon: "💻",
      label: "GitHub",
      href: personalInfo.github,
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="mt-12 p-12 rounded-xl border text-center"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))",
        borderColor: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        boxShadow: "var(--accent-glow)",
      }}
      aria-label="Contact"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-[32px] font-bold mb-6"
        style={{ color: "var(--text)" }}
      >
        {lang === "en" ? "Let's Connect" : "お問い合わせ"}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6"
        style={{ color: "var(--muted)" }}
      >
        {personalInfo.contactMessage[lang]}
      </motion.p>
      <div className="flex flex-wrap justify-center gap-5 mt-6">
        {contactLinks.map((link, index) => (
          <motion.a
            key={link.href}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={
              link.href.startsWith("http") ? "noopener noreferrer" : undefined
            }
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            whileHover={{
              y: -3,
              boxShadow: "0 0 20px rgba(0, 246, 255, 0.3)",
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all duration-250"
            style={{
              background: "rgba(0, 246, 255, 0.06)",
              borderColor: "rgba(0, 246, 255, 0.2)",
              boxShadow: "0 0 12px rgba(0, 246, 255, 0.08)",
              color: "var(--neon-cyan)",
              fontWeight: 600,
              fontSize: "15px",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget;
              target.style.background =
                "linear-gradient(90deg, rgba(0, 246, 255, 0.1), rgba(255, 108, 251, 0.1))";
              target.style.borderColor = "rgba(255, 108, 251, 0.3)";
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget;
              target.style.background = "rgba(0, 246, 255, 0.06)";
              target.style.borderColor = "rgba(0, 246, 255, 0.2)";
            }}
          >
            <span aria-hidden="true">{link.icon}</span>
            <span>{link.label}</span>
          </motion.a>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8 text-sm"
        style={{ color: "var(--muted)" }}
      >
        <p>{personalInfo.locationFootnote[lang]}</p>
      </motion.div>
    </section>
  );
}
