"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { personalInfo } from "@/lib/data";
import { useApp } from "@/lib/contexts/AppContext";

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

export default function Hero() {
  const { lang } = useApp();
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfWidth, setPdfWidth] = useState<number>(800);
  const fullTitle = personalInfo.title[lang];

  useEffect(() => {
    import("react-pdf").then((pdfjs) => {
      pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      setPdfWidth(Math.min(window.innerWidth - 100, 800));
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    setDisplayedTitle("");
    setIsTypingComplete(false);

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [fullTitle]);

  const handleViewResume = () => {
    setShowResumeModal(true);
    setPageNumber(1);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <>
      <section
        id="about"
        className="flex flex-col lg:flex-row gap-9 items-center p-9 lg:p-12 rounded-2xl relative overflow-hidden mt-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          boxShadow: "var(--accent-glow)",
        }}
        role="region"
        aria-label="Hero"
      >
        {/* Left Content */}
        <div className="flex-1 min-w-[260px]">
          {/* Name with Gradient */}
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-2 text-gradient">
            {personalInfo.name[lang]}
          </h1>

          {/* Typing Animation */}
          <div className="flex items-center gap-2 my-3">
            <span
              className={`inline-block text-xl font-medium ${
                !isTypingComplete ? "pr-1.5 animate-blink" : ""
              }`}
              style={{
                color: "var(--text)",
                borderRight: !isTypingComplete
                  ? "2px solid var(--text)"
                  : "none",
              }}
            >
              {displayedTitle}
            </span>
          </div>

          {/* Lead Text */}
          <p
            className="max-w-[580px] text-base leading-relaxed my-6"
            style={{ color: "var(--muted)" }}
          >
            {personalInfo.lead[lang]}
          </p>

          {/* CTA Button */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleViewResume}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(90deg, var(--neon-cyan), var(--neon-pink))",
                color: "#041018",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 246, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 14px rgba(0, 0, 0, 0.3)";
              }}
            >
              📄 {lang === "en" ? "View Resume" : "履歴書を見る"}
            </button>
          </div>
        </div>

        {/* Right Profile Image */}
        <div
          className="w-full lg:w-[280px] flex items-center justify-center lg:justify-end relative"
          aria-hidden="true"
        >
          <div className="relative w-52 h-52 lg:w-64 lg:h-64">
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))",
                padding: "3px",
              }}
            >
              <div
                className="w-full h-full rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #0b0b0b, #1a1a1a)",
                }}
              >
                <div className="relative w-full h-full" style={{ zIndex: 1 }}>
                  <Image
                    src="/profile.jpg"
                    alt={personalInfo.name[lang]}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setShowResumeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border"
              style={{
                background: "var(--panel)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowResumeModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-lg border-none flex items-center justify-center text-xl transition-all duration-200 z-10"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "var(--muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 0, 0, 0.2)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "var(--muted)";
                }}
                aria-label="Close modal"
              >
                ×
              </button>

              {/* Resume Content */}
              <div className="text-center mb-6">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: "var(--text)" }}
                >
                  {lang === "en" ? "Resume" : "履歴書"}
                </h2>
                <p style={{ color: "var(--muted)", fontSize: "14px" }}>
                  {lang === "en"
                    ? "Preview and download resume"
                    : "履歴書をプレビュー・ダウンロード"}
                </p>
              </div>

              {/* PDF Viewer */}
              <div className="relative w-full">
                <div className="flex justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <Document
                    file="/resume.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex items-center justify-center h-[600px]">
                        <div style={{ color: "var(--muted)" }}>
                          {lang === "en"
                            ? "Loading PDF..."
                            : "PDFを読み込み中..."}
                        </div>
                      </div>
                    }
                    error={
                      <div className="flex items-center justify-center h-[600px]">
                        <div style={{ color: "var(--muted)" }}>
                          {lang === "en"
                            ? "Failed to load PDF. Please try downloading."
                            : "PDFの読み込みに失敗しました。ダウンロードしてください。"}
                        </div>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={pdfWidth}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>

                {/* Page Navigation */}
                {numPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={goToPrevPage}
                      disabled={pageNumber <= 1}
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                      style={{
                        background:
                          pageNumber <= 1
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 246, 255, 0.1)",
                        color:
                          pageNumber <= 1 ? "var(--muted)" : "var(--neon-cyan)",
                        cursor: pageNumber <= 1 ? "not-allowed" : "pointer",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      ← {lang === "en" ? "Previous" : "前へ"}
                    </button>

                    <span style={{ color: "var(--text)" }}>
                      {pageNumber} / {numPages}
                    </span>

                    <button
                      onClick={goToNextPage}
                      disabled={pageNumber >= numPages}
                      className="px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                      style={{
                        background:
                          pageNumber >= numPages
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 246, 255, 0.1)",
                        color:
                          pageNumber >= numPages
                            ? "var(--muted)"
                            : "var(--neon-cyan)",
                        cursor:
                          pageNumber >= numPages ? "not-allowed" : "pointer",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      {lang === "en" ? "Next" : "次へ"} →
                    </button>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/resume.pdf";
                    link.download = "Taisei_Miyazaki_Resume.pdf";
                    link.click();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--neon-cyan), var(--neon-pink))",
                    color: "#041018",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  📥{" "}
                  {lang === "en"
                    ? "Download PDF Resume"
                    : "PDF履歴書をダウンロード"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
