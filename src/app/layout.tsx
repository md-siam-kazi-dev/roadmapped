import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";

import { Header } from "@/components/layout/header";
import { Providers } from "@/components/layout/providers";

import "./globals.css";

/*
 * DESIGN.md §2.2 — Typefaces.
 * - Inter        → body / UI (font-sans)
 * - Fraunces     → display H1/H2 (font-heading / font-display)
 * - IBM Plex Mono → data / countdowns / streak numbers (font-data / font-mono)
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  // Display face only at 28+ per DESIGN.md §2.2; variable optical size.
  axes: ["opsz"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Roadmapped",
  description:
    "A structured, streak-driven learning roadmap — YouTube content organized into ordered courses, unlocked one module a day.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}