"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  categories: string[];
}

interface BlogProps {
  lang: "en" | "ja";
}

export default function Blog({ lang }: BlogProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const rssUrl = encodeURIComponent(
          "https://medium.com/feed/@isemiya.0509"
        );
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data = await response.json();

        if (data.status === "ok") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedArticles = data.items.slice(0, 3).map((item: any) => {
            let thumbnail = "";
            if (item.thumbnail) {
              thumbnail = item.thumbnail;
            } else if (item.description) {
              const imgMatch = item.description.match(
                /<img[^>]+src="([^">]+)"/
              );
              if (imgMatch) {
                thumbnail = imgMatch[1];
              }
            }

            return {
              title: item.title,
              link: item.link,
              pubDate: item.pubDate,
              thumbnail,
              categories: item.categories || [],
            };
          });

          setArticles(formattedArticles);
        }
      } catch (error) {
        console.error("Error fetching Medium articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="mt-12 p-9 rounded-xl border"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))",
        borderColor: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
      }}
      aria-label="Blog"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="text-[32px] font-bold mb-6"
        style={{ color: "var(--text)" }}
      >
        {lang === "en" ? "Latest Articles" : "最新記事"}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {loading ? (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="p-6 rounded-xl border animate-pulse"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.05)",
                }}
              >
                <div
                  className="h-40 rounded-lg mb-4"
                  style={{ background: "rgba(255, 255, 255, 0.1)" }}
                />
                <div
                  className="h-4 rounded mb-3 w-1/3"
                  style={{ background: "rgba(255, 255, 255, 0.1)" }}
                />
                <div
                  className="h-6 rounded mb-3"
                  style={{ background: "rgba(255, 255, 255, 0.1)" }}
                />
                <div
                  className="h-4 rounded w-2/3"
                  style={{ background: "rgba(255, 255, 255, 0.1)" }}
                />
              </div>
            ))}
          </>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <BlogCard
              key={article.link}
              article={article}
              index={index}
              isInView={isInView}
              lang={lang}
            />
          ))
        ) : (
          <div
            className="col-span-full text-center py-12"
            style={{ color: "var(--muted)" }}
          >
            {lang === "en"
              ? "No articles found. Check back soon!"
              : "記事が見つかりませんでした。後ほどご確認ください！"}
          </div>
        )}
      </div>
      {articles.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8"
        >
          <a
            href="https://medium.com/@isemiya.0509"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border transition-all duration-250"
            style={{
              background: "rgba(0, 246, 255, 0.06)",
              borderColor: "rgba(0, 246, 255, 0.2)",
              color: "var(--neon-cyan)",
              fontWeight: 600,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(90deg, rgba(0, 246, 255, 0.1), rgba(255, 108, 251, 0.1))";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0, 246, 255, 0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {lang === "en" ? "View All Articles →" : "すべての記事を見る →"}
          </a>
        </motion.div>
      )}
    </section>
  );
}

interface BlogCardProps {
  article: MediumArticle;
  index: number;
  isInView: boolean;
  lang: "en" | "ja";
}

function BlogCard({ article, index, isInView, lang }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return lang === "en"
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : date.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -6 }}
      className="p-6 rounded-xl border cursor-pointer transition-all duration-300"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        borderColor: "rgba(255, 255, 255, 0.05)",
      }}
      onClick={() => window.open(article.link, "_blank")}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(0, 0, 0, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {article.thumbnail && (
        <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div
        className="text-xs font-semibold mb-2.5"
        style={{ color: "var(--neon-pink)" }}
      >
        {formatDate(article.pubDate)}
      </div>
      <h3
        className="text-lg font-bold mb-2.5 line-clamp-2"
        style={{ color: "var(--text)" }}
      >
        {article.title}
      </h3>
      {article.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {article.categories.slice(0, 3).map((category) => (
            <span
              key={category}
              className="text-xs px-2 py-1 rounded"
              style={{
                background: "rgba(0, 246, 255, 0.1)",
                color: "var(--neon-cyan)",
              }}
            >
              {category}
            </span>
          ))}
        </div>
      )}
      <div
        className="inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--neon-cyan)" }}
      >
        {lang === "en" ? "Read more" : "続きを読む"} →
      </div>
    </motion.article>
  );
}
