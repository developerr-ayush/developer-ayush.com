import { ogContentType, ogSize, renderOg } from "../../lib/og";

export const alt = "Ayush Shah's blog — Notes from the work";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    label: "Blog",
    title: [{ text: "Notes from the " }, { text: "work", accent: true }],
  });
}
