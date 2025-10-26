import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AppProvider } from "@/lib/contexts/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Taisei Miyazaki — Portfolio",
  description:
    "Full Stack Software Developer specializing in Flutter, React, and full-stack development. Building elegant, scalable experiences.",
  keywords: [
    "Taisei Miyazaki",
    "Software Developer",
    "Flutter",
    "React",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Taisei Miyazaki" }],
  openGraph: {
    title: "Taisei Miyazaki — Portfolio",
    description:
      "Full Stack Software Developer specializing in Flutter, React, and full-stack development.",
    type: "website",
    locale: "en_US",
    url: "https://taisei.dev",
    siteName: "Taisei Miyazaki Portfolio",
    images: [
      {
        url: "https://taisei.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Taisei Miyazaki - Senior Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taisei Miyazaki — Portfolio",
    description:
      "Full Stack Software Developer specializing in Flutter, React, and full-stack development.",
    images: ["https://taisei.dev/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "google-site-verification": "_hu07am10_znpXQzOfHy66arc1F8hTbEJXxeQKOWtfU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          {children}
          <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}
