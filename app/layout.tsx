import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${brand.name} · Gestión`,
  description: `Sistema de gestión para ${brand.name} ${brand.short}`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <style>{`
          :root {
            --accent: ${brand.accent};
            --accent-strong: ${brand.accentStrong};
            --accent-soft: ${brand.accentSoft};
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}