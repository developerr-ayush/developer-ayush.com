import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: {
    default: "Tech Products | Affiliate Deals & Reviews by Developer Ayush",
    template: "%s | Developer Ayush Products",
  },
  description:
    "Curated tech product picks showcased on Instagram. Find the best affiliate deals on laptops, headphones, smartphones, and more.",
  metadataBase: new URL("https://products.developer-ayush.com"),
  authors: [{ name: "Developer Ayush", url: "https://developer-ayush.com" }],
  creator: "Developer Ayush",
  openGraph: {
    type: "website",
    siteName: "Developer Ayush Products",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@ayushshah__",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
