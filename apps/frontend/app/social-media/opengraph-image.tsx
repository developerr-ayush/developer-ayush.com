import { ogContentType, ogSize, renderOg } from "../../lib/og";

export const alt = "Ayush Shah, elsewhere — social media links";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    label: "Links",
    title: [{ text: "Ayush Shah, " }, { text: "elsewhere", accent: true }],
  });
}
