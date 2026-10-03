import { ogContentType, ogSize, renderOg } from "../../lib/og";

export const alt = "AI Image Gallery — Made with prompts";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    label: "AI Image Gallery",
    title: [{ text: "Made with " }, { text: "prompts", accent: true }],
  });
}
