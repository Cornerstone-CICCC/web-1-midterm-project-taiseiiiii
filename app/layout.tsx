import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Taisei Miyazaki — Portfolio",
    description:
      "Full Stack Software Developer specializing in Flutter, React, and full-stack development.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
