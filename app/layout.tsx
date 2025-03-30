import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ayush Shah | UI/UX & Front-End Developer",
  description:
    "Portfolio of Ayush Shah, a UI/UX and Front-End Developer with experience in ReactJS, NextJS, and other modern web technologies.",
  keywords: [
    "UI/UX Developer",
    "Front-End Developer",
    "ReactJS",
    "NextJS",
    "Portfolio",
    "Web Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
