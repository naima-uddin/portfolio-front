import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";
import { getSiteContent } from "@/lib/siteContentService";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://naimauddin.dev"),
  title: "Naima Uddin — Frontend Developer | MERN Stack",
  description:
    "Frontend Developer at A2IT LTD with 2+ years of experience building scalable web applications with Next.js, React, and the MERN stack.",
  keywords: [
    "Naima Uddin",
    "Frontend Developer",
    "MERN Stack",
    "Next.js Developer",
    "React Developer",
    "Web Developer Bangladesh",
    "Portfolio",
  ],
  authors: [{ name: "Naima Uddin" }],
  creator: "Naima Uddin",
  icons: {
    icon: "/assets/logo/Logo.svg",
    shortcut: "/assets/logo/Logo.svg",
    apple: "/assets/logo/Logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://naimauddin.dev",
    title: "Naima Uddin — Frontend Developer | MERN Stack",
    description:
      "Frontend Developer at A2IT LTD. 2+ years building scalable web apps with Next.js and the MERN stack.",
    siteName: "Naima Uddin Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naima Uddin — Frontend Developer | MERN Stack",
    description:
      "Frontend Developer at A2IT LTD. 2+ years building scalable web apps with Next.js and the MERN stack.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f]`}
        suppressHydrationWarning
      >
        <ScrollProgress />
        <Header config={content.profile} />
        {children}
      </body>
    </html>
  );
}
