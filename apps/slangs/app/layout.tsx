import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#a855f7" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Gen Z Slang Dictionary | Latest Slang Terms & Meanings",
    template: "%s | Gen Z Slang Dictionary",
  },
  description:
    "The ultimate dictionary for Gen Z slang terms. Discover meanings, examples, and usage of the latest slang words. Search through hundreds of terms including 'no cap', 'periodt', 'slay', and more!",
  keywords: [
    "gen z slang",
    "slang dictionary",
    "modern slang",
    "internet slang",
    "what does no cap mean",
    "what does periodt mean",
    "what does slay mean",
    "what does bet mean",
    "what does fire mean",
    "what does sus mean",
    "slang meanings",
    "youth language",
    "trendy words",
    "social media slang",
    "slang terms with examples",
  ],
  authors: [{ name: "Developer Ayush", url: "https://developer-ayush.com" }],
  creator: "Developer Ayush",
  publisher: "Developer Ayush",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://slang.developer-ayush.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gen Z Slang Dictionary | Latest Slang Terms & Meanings",
    description:
      "Discover the latest Gen Z slang terms and their meanings. Search through hundreds of slang words with examples and learn modern internet language. No cap!",
    url: "https://slang.developer-ayush.com",
    siteName: "Gen Z Slang Dictionary",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gen Z Slang Dictionary - Learn the latest slang terms",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gen Z Slang Dictionary | Latest Slang Terms & Meanings",
    description:
      "Discover the latest Gen Z slang terms and their meanings. Search through hundreds of slang words with examples and learn modern internet language. No cap!",
    images: ["/og-image.png"],
    creator: "@ayushshah__",
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
  verification: {
    google: "your-google-verification-code", // Add your actual verification code
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GenZ Slang" />

        {/* Preconnect to external APIs for better performance */}
        <link rel="preconnect" href="https://admin.developer-ayush.com" />
        <link rel="dns-prefetch" href="https://admin.developer-ayush.com" />

        {/* FAQ Schema for common questions */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What does 'no cap' mean?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No cap means 'no lie' or 'for real'. It's used to emphasize that you're telling the truth or being serious about something.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What does 'periodt' mean?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Periodt is used for emphasis at the end of a statement, similar to 'period' but with extra attitude. It means 'end of discussion' or emphasizes that what was said is final.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What does 'slay' mean in Gen Z slang?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Slay means to do something exceptionally well or to look amazing. It's used to compliment someone who is performing excellently or looking great.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What does 'bet' mean?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Bet means 'okay', 'sure', or 'yes'. It's used to show agreement or confirm that you'll do something.",
                  },
                },
              ],
            }),
          }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
