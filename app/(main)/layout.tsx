import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/scss/index.scss";
import Header from "./Header";
import Footer from "./Footer";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });
import { AOSInit } from "./aosinit";
import { GoogleSite } from "@/component/GoogleSite";
export const metadata: Metadata = {
  title: "Developer Ayush",
  description: "Created using NextJs by Developer Ayush",
  icons: "/favicon.png",
  openGraph: {
    type: "website",
    url: "https://www.developer-ayush.com/",
    title: "Developer Ayush",
    description: "Created using NextJs by Developer Ayush",
    siteName: "Developer Ayush",
    images: "https://www.developer-ayush.com/assets/img/default-share.png",
  },
  twitter: {
    title: "Developer Ayush",
    description: "Created using NextJs by Developer Ayush",
    card: "summary_large_image",
    images: "https://www.developer-ayush.com/default-share.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleSite />

      <body className={`${inter.className} dark-mode`}>
        <GoogleAnalytics gaId="G-8FGDC36TL4" />
        <GoogleTagManager gtmId="GTM-WVCN3W56" />
        <Header />
        <main>
          <div className="container">{children}</div>
        </main>
        <Footer />
      </body>
      <AOSInit />
    </html>
  );
}
