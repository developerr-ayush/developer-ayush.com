import { Metadata } from "next";
import { Suspense } from "react";
import {
  getSlangTerms,
  getFeaturedSlang,
  getCategories,
  SlangTerm,
} from "@/lib/slang-api";
import SlangDictionaryClient from "@/components/SlangDictionaryClient";
import SkeletonGrid from "@/components/SkeletonGrid";

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

async function fetchInitialData() {
  try {
    // Try to fetch data, with fallbacks if any fail
    const [slangResponse, categories, featuredSlang] = await Promise.allSettled(
      [
        getSlangTerms({
          page: 1,
          limit: 12,
        }),
        getCategories(),
        getFeaturedSlang(),
      ]
    );

    const slangData =
      slangResponse.status === "fulfilled" && slangResponse.value.success
        ? slangResponse.value.data
        : [];

    const totalResults =
      slangResponse.status === "fulfilled" && slangResponse.value.meta?.total
        ? slangResponse.value.meta.total
        : 0;

    const allCategories =
      categories.status === "fulfilled"
        ? ["All", ...categories.value]
        : ["All", "General", "Compliment", "Behavior", "Quality", "Emotion"];

    const featured =
      featuredSlang.status === "fulfilled" ? featuredSlang.value : null;

    return {
      slangData,
      totalResults,
      allCategories,
      featured,
    };
  } catch (error) {
    console.error("Error fetching initial data:", error);
    // Return fallback data
    return {
      slangData: [],
      totalResults: 0,
      allCategories: [
        "All",
        "General",
        "Compliment",
        "Behavior",
        "Quality",
        "Emotion",
      ],
      featured: null,
    };
  }
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const selectedCategory = params.category || "All";
  const currentPage = parseInt(params.page || "1", 10);
  const itemsPerPage = 12;

  // Fetch initial data with error handling
  const { slangData, totalResults, allCategories, featured } =
    await fetchInitialData();

  // Generate structured data for SEO (only for initial load)
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
            {/* Header Skeleton */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-purple-200 dark:border-gray-700 sticky top-0 z-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center mb-8 animate-pulse">
                  <div className="h-12 bg-purple-200 dark:bg-purple-800/50 rounded-lg w-3/4 mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>

                  {/* Search and Filter Skeleton */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl sm:min-w-[200px]"></div>
                  </div>

                  {/* Results count skeleton */}
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <SkeletonGrid count={12} />
            </div>
          </div>
        }
      >
        <SlangDictionaryClient
          initialSlangData={slangData}
          initialCategories={allCategories}
          initialFeaturedSlang={featured}
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
