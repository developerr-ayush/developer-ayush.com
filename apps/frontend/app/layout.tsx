import "./globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { personalInfo } from "./data";
import Script from "next/script";
// import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://developer-ayush.com"),
  title: {
    template: "%s | Ayush Shah - Frontend Developer",
    default: "Ayush Shah - Frontend Developer & UI/UX Designer",
  },
  description:
    "Experienced Frontend Developer specializing in React, Next.js, and UI/UX design. Building performant, accessible, and beautiful web applications.",
  keywords: [
    "Frontend Developer",
    "React",
    "Next.js",
    "UI/UX Designer",
    "Web Developer",
    "JavaScript",
  ],
  authors: [{ name: "Ayush Shah" }],
  creator: "Ayush Shah",
  publisher: "Ayush Shah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://developer-ayush.com",
    siteName: personalInfo.name,
    title: `${personalInfo.name} - UI/UX & Frontend Developer`,
    description:
      "UI/UX & Frontend Developer specializing in creating responsive, user-friendly web experiences with modern technologies.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - UI/UX & Frontend Developer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${personalInfo.name} - UI/UX & Frontend Developer`,
    description:
      "UI/UX & Frontend Developer specializing in creating responsive, user-friendly web experiences with modern technologies.",
    images: ["/og-image.jpg"],
    creator: "@developerayush",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://developer-ayush.com",
  },
  verification: {
    // Add your verification codes here when you have them
    google: "your-google-verification-code",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  // Icons and favicons
  icons: {
    icon: [{ url: "/favicon.jpg?v=1", sizes: "any", type: "image/jpeg" }],
    apple: [{ url: "/favicon.jpg?v=1", sizes: "any", type: "image/jpeg" }],
    shortcut: [{ url: "/favicon.jpg?v=1", type: "image/jpeg" }],
  },
  manifest: "/site.webmanifest?v=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.jpg?v=1" type="image/jpeg" />
        <link rel="shortcut icon" href="/favicon.jpg?v=1" type="image/jpeg" />
        <link
          rel="apple-touch-icon"
          href="/favicon.jpg?v=1"
          type="image/jpeg"
        />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <meta name="msapplication-TileImage" content="/favicon.jpg?v=1" />
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WVCN3W56');`,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-background text-foreground min-h-screen`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WVCN3W56"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* <GoogleTagManager gtmId="GTM-WVCN3W56" /> */}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
