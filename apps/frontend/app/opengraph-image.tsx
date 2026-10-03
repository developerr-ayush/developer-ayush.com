import { ogContentType, ogSize, renderOg } from "../lib/og";

export const alt =
  "Ayush Shah — I build fast, accessible interfaces for products millions use.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    label: "Portfolio",
    title: [
      { text: "I build " },
      { text: "fast", accent: true },
      { text: ", accessible interfaces for products millions use." },
    ],
  });
}
