import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { getDefaultModel } from "../../../../lib/ai-config";

export interface ModelOption {
  id: string;
  label: string;
  description?: string;
}

let cache: { at: number; models: ModelOption[] } | null = null;
const TTL = 10 * 60 * 1000;

/**
 * GET /api/ai/models — Gemini models that support generateContent, live from Google's
 * ListModels API (so new releases appear without a deploy). Falls back to the
 * configured list if the key is missing or Google is unreachable.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const fallbackId = getDefaultModel("gemini");
  const fallback: ModelOption[] = [{ id: fallbackId, label: fallbackId }];
  const key = process.env.GEMINI_API_KEY;

  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json({ success: true, source: "google", default: pickDefault(cache.models, fallbackId), models: cache.models });
  }
  if (!key) {
    return NextResponse.json({ success: true, source: "config", default: fallbackId, models: fallback });
  }

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${key}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Google responded ${res.status}`);
    const data = (await res.json()) as {
      models?: { name: string; displayName?: string; description?: string; supportedGenerationMethods?: string[] }[];
    };
    const models = (data.models ?? [])
      .filter((m) => m.name.startsWith("models/gemini") && m.supportedGenerationMethods?.includes("generateContent"))
      // text models only: skip image/audio/tts/embedding variants
      .filter((m) => !/(image|tts|audio|embedding|live|aqa|vision)/i.test(m.name))
      .map((m) => ({ id: m.name.replace("models/", ""), label: m.displayName ?? m.name.replace("models/", ""), description: m.description?.slice(0, 140) }))
      .sort((a, b) => Number(/flash/.test(b.id)) - Number(/flash/.test(a.id)) || b.id.localeCompare(a.id));
    if (!models.length) throw new Error("No models returned");
    cache = { at: Date.now(), models };
    return NextResponse.json({ success: true, source: "google", default: pickDefault(models, fallbackId), models });
  } catch (e) {
    console.error("Listing Gemini models failed:", e);
    return NextResponse.json({ success: true, source: "config", default: fallbackId, models: fallback });
  }
}

/** Flash is always the default: the configured one if Google still lists it, else the newest flash. */
function pickDefault(models: ModelOption[], configured: string) {
  if (models.some((m) => m.id === configured)) return configured;
  return (models.find((m) => /flash/.test(m.id) && !/lite/.test(m.id)) ?? models[0]!).id;
}
