"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { projects } from "@/lib/data";
import { useApp } from "@/lib/contexts/AppContext";

export default function Works() {
  const { lang } = useApp();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="works"
      ref={sectionRef}
      className="mt-12 p-9 rounded-xl border"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))",
        borderColor: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
      }}
      aria-label="Works"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-[32px] font-bold mb-6"
        style={{ color: "var(--text)" }}
      >
        {lang === "en" ? "Projects" : "プロジェクト"}
      </motion.h2>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isInView={isInView}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: (typeof projects)[0];
  index: number;
  isInView: boolean;
  lang: "en" | "ja";
}

function ProjectCard({ project, index, isInView, lang }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "";
  };

  const getIconForProject = (projectId: string) => {
    if (projectId === "icon-checkbox") {
      return (
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect
            x="30"
            y="30"
            width="60"
            height="60"
            rx="8"
            fill="rgba(0,246,255,0.2)"
            stroke="rgba(0,246,255,0.5)"
            strokeWidth="2"
          />
          <path
            d="M 45 60 L 55 70 L 75 50"
            stroke="rgba(255,108,251,0.8)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    } else if (projectId === "custom-vimeo-player") {
      return (
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect
            x="25"
            y="35"
            width="70"
            height="50"
            rx="6"
            fill="rgba(0,246,255,0.15)"
            stroke="rgba(0,246,255,0.5)"
            strokeWidth="2"
          />
          <polygon points="50,50 50,70 70,60" fill="rgba(255,108,251,0.8)" />
        </svg>
      );
    } else if (projectId === "yamada-ui") {
      return (
        <svg width="120" height="120" viewBox="0 0 120 120">
          <rect
            x="25"
            y="35"
            width="70"
            height="50"
            rx="6"
            fill="rgba(0,246,255,0.15)"
            stroke="rgba(0,246,255,0.5)"
            strokeWidth="2"
          />
          <circle cx="45" cy="55" r="8" fill="rgba(255,108,251,0.4)" />
          <circle cx="75" cy="55" r="8" fill="rgba(255,108,251,0.4)" />
          <path
            d="M 40 70 Q 60 80, 80 70"
            stroke="rgba(0,246,255,0.5)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="rounded-xl border overflow-hidden cursor-pointer"
      style={{
        background: "var(--panel)",
        borderColor: "rgba(255, 255, 255, 0.05)",
        transformStyle: "preserve-3d",
        transition: "all 0.3s ease",
      }}
      whileHover={{
        borderColor: "rgba(0, 246, 255, 0.2)",
        boxShadow: "0 16px 48px rgba(0, 0, 0, 0.6)",
      }}
      onClick={() => window.open(project.link, "_blank")}
    >
      {/* Project Image */}
      <div className="w-full h-[180px] relative overflow-hidden bg-gradient-to-br from-[rgba(0,246,255,0.1)] to-[rgba(255,108,251,0.1)]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getIconForProject(project.id)}
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
          {project.title}
        </h3>
        {/* Badge */}
        <div className="mb-3">
          {project.type === "package" && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded"
              style={{
                background: "rgba(0, 246, 255, 0.1)",
                color: "var(--neon-cyan)",
              }}
            >
              📦 Package
            </span>
          )}
          {project.type === "oss" && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded"
              style={{
                background: "rgba(255, 108, 251, 0.1)",
                color: "var(--neon-pink)",
              }}
            >
              ⭐ OSS
            </span>
          )}
        </div>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: "var(--muted)" }}
        >
          {project.description[lang]}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block text-xs px-2.5 py-1.5 rounded-md border"
              style={{
                color: "var(--muted)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {/* View Link */}
        <div
          className="inline-flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--neon-cyan)" }}
        >
          {lang === "en" ? "View project" : "プロジェクトを見る"} →
        </div>
      </div>
    </motion.article>
  );
}
