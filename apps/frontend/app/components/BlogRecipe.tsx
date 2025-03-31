"use client";

import { useId } from "react";
import Image from "next/image";
import Script from "next/script";

type RecipeStep = {
  text: string;
  image?: string;
};

type RecipeProps = {
  name: string;
  description: string;
  authorName: string;
  datePublished: string;
  image: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  prepTime?: string; // ISO 8601 duration format, e.g., "PT15M" for 15 minutes
  cookTime?: string;
  totalTime?: string;
  keywords?: string[];
  recipeYield?: string;
  ingredients: string[];
  instructions: RecipeStep[];
  ratingValue?: number;
  ratingCount?: number;
};

export default function BlogRecipe({
  name,
  description,
  authorName,
  datePublished,
  image,
  recipeCategory,
  recipeCuisine,
  prepTime,
  cookTime,
  totalTime,
  keywords,
  recipeYield,
  ingredients,
  instructions,
  ratingValue,
  ratingCount,
}: RecipeProps) {
  const id = useId();

  // Create structured data for recipe
  const recipeSchema = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    name,
    description,
    author: {
      "@type": "Person",
      name: authorName,
    },
    datePublished,
    image,
    ...(recipeCategory && { recipeCategory }),
    ...(recipeCuisine && { recipeCuisine }),
    ...(prepTime && { prepTime }),
    ...(cookTime && { cookTime }),
    ...(totalTime && { totalTime }),
    ...(keywords && { keywords: keywords.join(", ") }),
    ...(recipeYield && { recipeYield }),
    recipeIngredient: ingredients,
    recipeInstructions: instructions.map((step, index) => ({
      "@type": "HowToStep",
      text: step.text,
      ...(step.image && { image: step.image }),
      position: index + 1,
    })),
    ...(ratingValue &&
      ratingCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue,
          ratingCount,
        },
      }),
  };

  return (
    <div className="recipe-card my-12 border border-foreground/10 rounded-lg overflow-hidden bg-foreground/5">
      {/* Add structured data for recipe */}
      <Script
        id={`recipe-schema-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />

      {/* Recipe header */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <p className="text-white/80 mt-2">{description}</p>
          </div>
        </div>
      </div>

      {/* Recipe details */}
      <div className="p-6">
        {/* Recipe meta */}
        <div className="flex flex-wrap gap-6 mb-6 text-sm">
          {prepTime && (
            <div>
              <span className="block text-foreground/60">Prep Time</span>
              <span className="font-medium">{formatDuration(prepTime)}</span>
            </div>
          )}
          {cookTime && (
            <div>
              <span className="block text-foreground/60">Cook Time</span>
              <span className="font-medium">{formatDuration(cookTime)}</span>
            </div>
          )}
          {totalTime && (
            <div>
              <span className="block text-foreground/60">Total Time</span>
              <span className="font-medium">{formatDuration(totalTime)}</span>
            </div>
          )}
          {recipeYield && (
            <div>
              <span className="block text-foreground/60">Servings</span>
              <span className="font-medium">{recipeYield}</span>
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
          <ul className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className=" w-6 h-6 rounded-full bg-sky-500/20 text-sky-500 flex items-center justify-center mr-3 mt-0.5">
                  •
                </span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Instructions</h3>
          <ol className="space-y-6">
            {instructions.map((step, index) => (
              <li key={index} className="flex">
                <span className=" w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-medium mr-4 mt-0.5 flex-shrink-0">
                  {index + 1}
                </span>
                <div>
                  <p>{step.text}</p>
                  {step.image && (
                    <div className="mt-3 relative h-40 rounded-lg overflow-hidden">
                      <Image
                        src={step.image}
                        alt={`Step ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
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
