import type { Metadata } from "next";
import localFont from "next/font/local";
import type { CSSProperties } from "react";
import { prospect } from "@/config/prospect";
import { Providers } from "./providers";
import "./globals.css";

const sora = localFont({
  src: "./fonts/sora-latin.woff2",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: prospect.copy.metadata.title,
  description: prospect.copy.metadata.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${sora.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full"
        style={{
          "--club-primary": prospect.branding.primaryColor,
          "--club-secondary": prospect.branding.secondaryColor,
          "--club-accent": prospect.branding.accentColor ?? prospect.branding.secondaryColor,
        } as CSSProperties}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
