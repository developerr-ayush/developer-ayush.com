import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "app/assets/fonts");

type Part = { text: string; accent?: boolean };

/** Split styled parts into words; a word may mix styles (e.g. "fast,"). */
function toWords(parts: Part[]): Part[][] {
  const words: Part[][] = [[]];
  for (const part of parts) {
    part.text.split(/( +)/).forEach((chunk) => {
      if (!chunk) return;
      if (chunk.trim() === "") {
        if (words[words.length - 1]!.length) words.push([]);
      } else {
        words[words.length - 1]!.push({ text: chunk, accent: part.accent });
      }
    });
  }
  return words.filter((w) => w.length);
}

/** Shared Open Graph card: paper background, serif headline, mono labels. */
export async function renderOg({
  label,
  title,
}: {
  label: string;
  title: Part[];
}) {
  const [serif, serifItalic, mono] = await Promise.all([
    readFile(join(fontDir, "instrument-serif-latin-400-normal.woff")),
    readFile(join(fontDir, "instrument-serif-latin-400-italic.woff")),
    readFile(join(fontDir, "geist-mono-latin-400-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#f5f3ee",
          color: "#16150f",
          fontFamily: "Geist Mono",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#57534a",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: "#b8360f",
              }}
            />
            <span style={{ color: "#16150f" }}>Ayush Shah</span>
          </div>
          <span>{label}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "Instrument Serif",
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: -2,
            rowGap: 4,
            maxWidth: 1056,
          }}
        >
          {toWords(title).map((word, i) => (
            // each word is one flex item so lines wrap between words
            <div key={i} style={{ display: "flex", marginRight: 26 }}>
              {word.map((piece, j) => (
                <span
                  key={j}
                  style={{
                    color: piece.accent ? "#b8360f" : "#16150f",
                    fontStyle: piece.accent ? "italic" : "normal",
                  }}
                >
                  {piece.text}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #d6d1c4",
            paddingTop: 24,
            fontSize: 22,
            color: "#57534a",
          }}
        >
          <span>developer-ayush.com</span>
          <span>Frontend Engineer · Mumbai</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: serifItalic, style: "italic", weight: 400 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    }
  );
}
