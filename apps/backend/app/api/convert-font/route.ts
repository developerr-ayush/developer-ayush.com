import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Maximum upload size and allowed extensions
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = new Set([".ttf", ".otf"]);

type ConversionResult = {
  filename: string;
  buffer: Buffer;
};

function getExtensionFromName(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function sanitizeBaseName(name: string): string {
  const withoutExt = name.replace(/\.[^.]+$/, "");
  return withoutExt.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function displayFontName(name: string): string {
  const noExt = name.replace(/\.[^.]+$/, "");
  const spaced = noExt.replace(/[-_]+/g, " ");
  return spaced.replace(/\s+/g, " ").trim();
}

async function convertOtfToTtf(input: Buffer): Promise<Buffer> {
  const mod = await import("fonteditor-core");
  const Font = (mod as any).Font;
  const font = Font.create(input, { type: "otf" });
  const ttfArrayBuffer: ArrayBuffer = font.write({
    type: "ttf",
    hinting: true,
  });
  return Buffer.from(new Uint8Array(ttfArrayBuffer));
}

async function toWoff(ttfBuffer: Buffer): Promise<Buffer> {
  const ttf2woff =
    (await import("ttf2woff")).default ?? (await import("ttf2woff"));
  const woffResult: any = (ttf2woff as any)(ttfBuffer, {});
  // Some versions return Buffer directly, others return { buffer }
  if (Buffer.isBuffer(woffResult)) return woffResult;
  if (woffResult?.buffer) return Buffer.from(woffResult.buffer);
  throw new Error("Failed to produce WOFF");
}

async function toEot(ttfBuffer: Buffer): Promise<Buffer> {
  const ttf2eot =
    (await import("ttf2eot")).default ?? (await import("ttf2eot"));
  const eotResult: any = (ttf2eot as any)(ttfBuffer);
  // Some versions return Buffer, others return { buffer }
  if (Buffer.isBuffer(eotResult)) return eotResult;
  if (eotResult?.buffer) return Buffer.from(eotResult.buffer);
  if (eotResult instanceof ArrayBuffer)
    return Buffer.from(new Uint8Array(eotResult as ArrayBuffer));
  throw new Error("Failed to produce EOT");
}

async function toWoff2(ttfBuffer: Buffer): Promise<Buffer> {
  // Try ttf2woff2 first (pure Node binding), then woff2, else fail
  try {
    const ttf2woff2 =
      (await import("ttf2woff2")).default ?? (await import("ttf2woff2"));
    const out = (ttf2woff2 as any)(ttfBuffer);
    if (Buffer.isBuffer(out)) return out;
    if (out instanceof Uint8Array) return Buffer.from(out);
  } catch (_) {}
  try {
    const woff2mod: any = await import("woff2");
    const out = await woff2mod.encode(ttfBuffer);
    if (Buffer.isBuffer(out)) return out;
  } catch (_) {}
  throw new Error("WOFF2 conversion unavailable");
}

async function toSvgFromTtf(ttfBuffer: Buffer): Promise<Buffer> {
  const mod = await import("fonteditor-core");
  const Font = (mod as any).Font;
  const font = Font.create(ttfBuffer, { type: "ttf" });
  const svgArrayBuffer: ArrayBuffer = font.write({ type: "svg" });
  return Buffer.from(new Uint8Array(svgArrayBuffer));
}

function buildCss(
  family: string,
  baseName: string,
  presentFormats: {
    woff2?: boolean;
    woff?: boolean;
    eot?: boolean;
    ttf?: boolean;
    svg?: boolean;
  }
): string {
  const sources: string[] = [];
  if (presentFormats.eot) {
    sources.push(`url('${baseName}.eot?#iefix') format('embedded-opentype')`);
  }
  if (presentFormats.woff2) {
    sources.push(`url('${baseName}.woff2') format('woff2')`);
  }
  if (presentFormats.woff) {
    sources.push(`url('${baseName}.woff') format('woff')`);
  }
  if (presentFormats.ttf) {
    sources.push(`url('${baseName}.ttf') format('truetype')`);
  }
  if (presentFormats.svg) {
    sources.push(`url('${baseName}.svg#${baseName}') format('svg')`);
  }

  // IE requires separate first src for .eot
  const eotFirst = presentFormats.eot ? `  src: url('${baseName}.eot');\n` : "";

  return `@font-face {\n  font-family: '${family}';\n${eotFirst}  src: ${sources.join(",\n       ")} ;\n  font-weight: 400;\n  font-style: normal;\n  font-display: swap;\n}\n`;
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get("file") as unknown as File | null;

    // Allow multiple ways to pass formats: formats[]=, formats, or single string
    const allFormatsRaw: string[] = [];
    const formatsEntries = form.getAll("formats[]");
    if (formatsEntries.length)
      allFormatsRaw.push(...(formatsEntries as string[]));
    const formatsEntries2 = form.getAll("formats");
    if (formatsEntries2.length)
      allFormatsRaw.push(...(formatsEntries2 as string[]));
    const formatSingle = form.get("format");
    if (formatSingle && typeof formatSingle === "string")
      allFormatsRaw.push(formatSingle);

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const originalName = (file as any).name || "font.ttf";
    const ext = getExtensionFromName(originalName);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return new Response(
        JSON.stringify({ error: "Only .ttf or .otf files are allowed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const size = (file as any).size as number;
    if (size > MAX_FILE_SIZE_BYTES) {
      return new Response(
        JSON.stringify({ error: "File too large (max 5MB)" }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestedFormats = new Set(
      allFormatsRaw
        .map((f) => String(f).toLowerCase())
        .filter((f) => ["woff2", "woff", "eot", "svg", "keep-ttf"].includes(f))
    );
    if (requestedFormats.size === 0) {
      // default sensible formats
      requestedFormats.add("woff2");
      requestedFormats.add("woff");
    }

    const arrayBuffer = await (file as any).arrayBuffer();
    let inputBuffer = Buffer.from(arrayBuffer);
    let ttfBuffer: Buffer | null = null;

    if (ext === ".otf") {
      ttfBuffer = await convertOtfToTtf(inputBuffer);
    } else {
      ttfBuffer = inputBuffer;
    }

    const baseName = sanitizeBaseName(originalName) || "webfont";
    const familyName = displayFontName(originalName) || "WebFont";

    const results: ConversionResult[] = [];
    const present: { [k: string]: boolean } = {};

    // keep-ttf
    if (requestedFormats.has("keep-ttf") && ttfBuffer) {
      results.push({ filename: `${baseName}.ttf`, buffer: ttfBuffer });
      present["ttf"] = true;
    }

    // woff2
    if (requestedFormats.has("woff2")) {
      try {
        const w2 = await toWoff2(ttfBuffer!);
        results.push({ filename: `${baseName}.woff2`, buffer: w2 });
        present["woff2"] = true;
      } catch (err) {
        // fallback: skip woff2 if unavailable
      }
    }

    // woff
    if (requestedFormats.has("woff")) {
      try {
        const w = await toWoff(ttfBuffer!);
        results.push({ filename: `${baseName}.woff`, buffer: w });
        present["woff"] = true;
      } catch {}
    }

    // eot
    if (requestedFormats.has("eot")) {
      try {
        const e = await toEot(ttfBuffer!);
        results.push({ filename: `${baseName}.eot`, buffer: e });
        present["eot"] = true;
      } catch {}
    }

    // svg
    if (requestedFormats.has("svg")) {
      try {
        const s = await toSvgFromTtf(ttfBuffer!);
        results.push({ filename: `${baseName}.svg`, buffer: s });
        present["svg"] = true;
      } catch {}
    }

    if (results.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No formats produced. Try selecting WOFF/TTF.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const css = buildCss(familyName, baseName, {
      woff2: !!present["woff2"],
      woff: !!present["woff"],
      eot: !!present["eot"],
      ttf: !!present["ttf"],
      svg: !!present["svg"],
    });

    // Build a ZIP in-memory
    const archiver =
      (await import("archiver")).default ?? (await import("archiver"));
    const { PassThrough } = await import("node:stream");
    const archive = (archiver as any)("zip", { zlib: { level: 9 } });
    for (const f of results) {
      (archive as any).append(f.buffer, { name: f.filename });
    }
    (archive as any).append(Buffer.from(css, "utf8"), { name: "styles.css" });

    (archive as any).on("warning", (err: any) => {
      console.warn("archiver warning", err);
    });

    const pass = new PassThrough();
    const chunks: Buffer[] = [];
    pass.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
    const done = new Promise<void>((resolve, reject) => {
      pass.on("end", () => resolve());
      pass.on("error", (e) => reject(e));
    });
    (archive as any).pipe(pass);
    (archive as any).finalize();
    await done;
    const zipBuffer = Buffer.concat(chunks);

    const zipName = `${baseName}-web.zip`;

    const body = new Uint8Array(zipBuffer);
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("convert-font error", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Conversion failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
