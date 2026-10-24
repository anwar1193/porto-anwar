import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Anwar — Fullstack & Backend Engineer",
    template: "%s — Anwar.dev",
  },
  description:
    "Portfolio of Anwar, a software engineering graduate building resilient backend architectures and polished fullstack interfaces.",
  applicationName: "Anwar.dev",
  authors: [{ name: "Anwar" }],
  keywords: [
    "Anwar",
    "Fullstack Developer",
    "Backend Engineer",
    "Laravel",
    "Next.js",
    "Portfolio",
  ],
  openGraph: {
    title: "Anwar — Fullstack & Backend Engineer",
    description:
      "Engineering resilient distributed architectures and elegant interfaces.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster theme="light" position="top-center" />
      </body>
    </html>
  );
}
