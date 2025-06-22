import { Metadata } from "next";
import { Suspense } from "react";
import {
  getSlangTerms,
  getFeaturedSlang,
  getCategories,
  SlangTerm,
} from "@/lib/slang-api";
import SlangDictionaryClient from "@/components/SlangDictionaryClient";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search;
  const category = params.category;

  let title = "Gen Z Slang Dictionary | Latest Slang Terms & Meanings";
  let description =
    "Discover the latest Gen Z slang terms and their meanings. Search through hundreds of slang words with examples and learn modern internet language. No cap!";

  // Dynamic SEO based on search/filter
  if (search) {
    title = `"${search}" Meaning | Gen Z Slang Dictionary`;
    description = `What does "${search}" mean? Find the meaning, examples, and usage of "${search}" and other Gen Z slang terms. Stay updated with modern internet language.`;
  } else if (category && category !== "All") {
    title = `${category} Slang Terms | Gen Z Dictionary`;
    description = `Explore ${category.toLowerCase()} slang terms and their meanings. Learn the latest Gen Z language in the ${category.toLowerCase()} category with examples.`;
  }

  const keywords = [
    "gen z slang",
    "slang dictionary",
    "modern slang",
    "internet slang",
    "what does mean",
    "slang meanings",
    "youth language",
    "trendy words",
    "social media slang",
    "no cap meaning",
    "periodt meaning",
    "slay meaning",
    "bet meaning",
    "fire meaning",
    "sus meaning",
    search,
    category,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Developer Ayush" }],
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
      title,
      description,
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
      title,
      description,
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
  };
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const selectedCategory = params.category || "All";
  const currentPage = parseInt(params.page || "1", 10);
  const itemsPerPage = 12;

  // Fetch data on server side
  const [slangResponse, categories, featuredSlang] = await Promise.all([
    getSlangTerms({
      search: search || undefined,
      category: selectedCategory !== "All" ? selectedCategory : undefined,
      page: currentPage,
      limit: itemsPerPage,
    }),
    getCategories(),
    getFeaturedSlang(),
  ]);

  const slangData = slangResponse.success ? slangResponse.data : [];
  const totalResults = slangResponse.meta?.total || 0;
  const allCategories = ["All", ...categories];

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://slang.developer-ayush.com/#website",
        url: "https://slang.developer-ayush.com",
        name: "Gen Z Slang Dictionary",
        description:
          "The ultimate dictionary for Gen Z slang terms with meanings and examples",
        publisher: {
          "@type": "Person",
          name: "Developer Ayush",
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://slang.developer-ayush.com/?search={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://slang.developer-ayush.com/#webpage",
        url: "https://slang.developer-ayush.com",
        name: "Gen Z Slang Dictionary | Latest Slang Terms & Meanings",
        isPartOf: {
          "@id": "https://slang.developer-ayush.com/#website",
        },
        about: {
          "@type": "Thing",
          name: "Gen Z Slang Terms",
        },
        description:
          "Discover the latest Gen Z slang terms and their meanings. Search through hundreds of slang words with examples.",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: totalResults,
          itemListElement: slangData.map((slang, index) => ({
            "@type": "DefinedTerm",
            "@id": `https://slang.developer-ayush.com/#${slang.term?.toLowerCase().replace(/\s+/g, "-")}`,
            name: slang.term,
            description: slang.meaning,
            identifier: slang.term,
            ...(slang.example && {
              example: {
                "@type": "CreativeWork",
                text: slang.example,
              },
            }),
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              name: `${slang.category} Slang Terms`,
            },
          })),
        },
      },
      // Add individual defined terms for better SEO
      ...slangData.map((slang) => ({
        "@type": "DefinedTerm",
        "@id": `https://slang.developer-ayush.com/#${slang.term?.toLowerCase().replace(/\s+/g, "-")}`,
        name: slang.term,
        description: slang.meaning,
        identifier: slang.term,
        ...(slang.example && {
          example: {
            "@type": "CreativeWork",
            text: slang.example,
          },
        }),
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: `${slang.category} Slang Terms`,
          description: `Collection of ${slang.category.toLowerCase()} slang terms`,
        },
      })),
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Main Content */}
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Loading slang terms...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Getting the latest Gen Z slang for you! 🔥
                </p>
              </div>
            </div>
          </div>
        }
      >
        <SlangDictionaryClient
          initialSlangData={slangData}
          initialCategories={allCategories}
          initialFeaturedSlang={featuredSlang}
          initialTotalResults={totalResults}
          initialSearch={search}
          initialCategory={selectedCategory}
          initialPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </Suspense>
    </>
  );
}
