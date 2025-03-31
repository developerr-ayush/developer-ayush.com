"use client";

import { useId } from "react";
import Image from "next/image";
import Script from "next/script";

type HowToStep = {
  name: string;
  text: string;
  image?: string;
  url?: string;
};

type HowToTool = {
  name: string;
  description?: string;
  url?: string;
  image?: string;
};

type HowToSupply = {
  name: string;
  description?: string;
  url?: string;
  image?: string;
};

type HowToProps = {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration format, e.g., "PT1H30M"
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: HowToSupply[];
  tools?: HowToTool[];
  steps: HowToStep[];
};

export default function BlogHowTo({
  name,
  description,
  image,
  totalTime,
  estimatedCost,
  supply,
  tools,
  steps,
}: HowToProps) {
  const id = useId();

  // Create structured data for howto
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(image && { image }),
    ...(totalTime && { totalTime }),
    ...(estimatedCost && {
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: estimatedCost.currency,
        value: estimatedCost.value,
      },
    }),
    ...(supply &&
      supply.length > 0 && {
        supply: supply.map((item) => ({
          "@type": "HowToSupply",
          name: item.name,
          ...(item.description && { description: item.description }),
          ...(item.url && { url: item.url }),
          ...(item.image && { image: item.image }),
        })),
      }),
    ...(tools &&
      tools.length > 0 && {
        tool: tools.map((item) => ({
          "@type": "HowToTool",
          name: item.name,
          ...(item.description && { description: item.description }),
          ...(item.url && { url: item.url }),
          ...(item.image && { image: item.image }),
        })),
      }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
      ...(step.url && { url: step.url }),
      ...(step.image && { image: step.image }),
      position: index + 1,
    })),
  };

  return (
    <div className="how-to-card my-12">
      {/* Add structured data for howto */}
      <Script
        id={`howto-schema-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* How-To Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{name}</h2>
        <p className="text-foreground/80">{description}</p>

        {/* Meta information */}
        <div className="flex flex-wrap gap-6 mt-6 text-sm">
          {totalTime && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-sky-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Total time:{" "}
                <span className="font-medium">{formatDuration(totalTime)}</span>
              </span>
            </div>
          )}

          {estimatedCost && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-sky-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Cost:{" "}
                <span className="font-medium">
                  {estimatedCost.value} {estimatedCost.currency}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tools and Supplies */}
      {tools && tools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Tools */}
          {tools && tools.length > 0 && (
            <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
              <h3 className="text-xl font-semibold mb-4">Tools</h3>
              <ul className="space-y-3">
                {tools.map((tool, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-sky-500 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div>
                      <span className="font-medium">{tool.name}</span>
                      {tool.description && (
                        <p className="text-sm text-foreground/70 mt-1">
                          {tool.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Supplies */}
          {supply && supply.length > 0 && (
            <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
              <h3 className="text-xl font-semibold mb-4">Materials</h3>
              <ul className="space-y-3">
                {supply.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-sky-500 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.description && (
                        <p className="text-sm text-foreground/70 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Steps */}
      <div>
        <h3 className="text-xl font-semibold mb-6">Steps</h3>
        <ol className="space-y-8">
          {steps.map((step, index) => (
            <li key={index} className="flex">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-sky-500 text-white font-semibold mr-4">
                {index + 1}
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">{step.name}</h4>
                <p className="text-foreground/80">{step.text}</p>
                {step.image && (
                  <div className="mt-4 relative h-64 rounded-lg overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// Helper function to format ISO duration to human readable format
function formatDuration(isoDuration: string): string {
  // Simple conversion from ISO 8601 durations like PT1H30M to "1 hr 30 min"
  const hours = isoDuration.match(/(\d+)H/);
  const minutes = isoDuration.match(/(\d+)M/);

  let result = "";
  if (hours) result += `${hours[1]} hr `;
  if (minutes) result += `${minutes[1]} min`;

  return result.trim();
}
