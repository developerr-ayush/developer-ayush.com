import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Ayush Shah",
  description:
    "Check out my latest blog posts on web development and programming",
  openGraph: {
    title: "Blog | Ayush Shah",
    description:
      "Check out my latest blog posts on web development and programming",
    url: "https://developer-ayush.com/blog",
    siteName: "Ayush Shah",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ayush Shah Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
