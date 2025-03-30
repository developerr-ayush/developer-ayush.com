"use client";

import { useId } from "react";
import Script from "next/script";

type FAQItem = {
  question: string;
  answer: string;
};

type BlogFAQProps = {
  faqs: FAQItem[];
  title?: string;
};

export default function BlogFAQ({
  faqs,
  title = "Frequently Asked Questions",
}: BlogFAQProps) {
  const id = useId();

  // Skip rendering if no FAQs
  if (!faqs || faqs.length === 0) {
    return null;
  }

  // Create FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="my-12">
      {/* Add structured data for FAQs */}
      <Script
        id={`faq-schema-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="border border-foreground/10 rounded-lg overflow-hidden"
          >
            <summary className="p-4 cursor-pointer bg-foreground/5 hover:bg-foreground/10 font-medium">
              {faq.question}
            </summary>
            <div className="p-4 bg-foreground/[0.03]">
              <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
