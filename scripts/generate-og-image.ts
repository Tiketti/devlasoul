import { readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { load } from "opentype.js";
import type { Font } from "opentype.js";

type ExtractedContent = {
  title: string;
  titleSize: string;
  taglines: string[];
  taglineSize: string;
};

// Tailwind font size mapping (in pixels).
// This does not map 1:1 with actual TW sizes, but instead what
// we should look good in the image.
const TAILWIND_SIZES = {
  "text-2xl": "48px",
  "text-6xl": "108px",
  "text-7xl": "120px",
  "text-8xl": "144px",
};

async function extractFromApp(): Promise<ExtractedContent> {
  const appContent = await readFile(
    join(process.cwd(), "src/App.tsx"),
    "utf-8",
  );

  // Extract title and its size from h1
  const titleElement = appContent.match(/<h1[^>]*>[\s\n]*(.*?)[\s\n]*<\/h1>/);
  const titleClassMatch = titleElement?.[0].match(/className="([^"]+)"/);
  const titleSizeMatch = titleClassMatch?.[1].match(/text-(6xl|7xl|8xl)/);
  const title = titleElement ? titleElement[1].trim() : "DEV LA SOUL";

  // Extract taglines and their size from h2s
  const taglineElements = Array.from(
    appContent.matchAll(/<h2[^>]*>[\s\n]*(.*?)[\s\n]*<\/h2>/g),
  );
  const taglines = taglineElements.map((match) => match[1].trim());

  const taglineClassMatch =
    taglineElements[0]?.[0].match(/className="([^"]+)"/);
  const taglineSizeMatch = taglineClassMatch?.[1].match(/text-(2xl)/);

  // Use the extracted sizes, defaulting to 8xl for title and 2xl for taglines if not found
  const titleSize = titleSizeMatch
    ? TAILWIND_SIZES[`text-${titleSizeMatch[1]}`]
    : TAILWIND_SIZES["text-8xl"];

  const taglineSize = taglineSizeMatch
    ? TAILWIND_SIZES[`text-${taglineSizeMatch[1]}`]
    : TAILWIND_SIZES["text-2xl"];

  console.debug({ title, titleSize, taglines, taglineSize });

  return { title, titleSize, taglines, taglineSize };
}

async function textToPath(
  text: string,
  x: number,
  y: number,
  fontSize: string,
  font: Font,
): Promise<string> {
  const size = Number.parseInt(fontSize, 10);
  // First create the path at x=0 to measure it
  const path = font.getPath(text, 0, y, size);
  // Get the bounding box to calculate width
  const bbox = path.getBoundingBox();
  // Create new path with centered x position
  const centeredPath = font.getPath(text, x - (bbox.x2 - bbox.x1) / 2, y, size);
  return centeredPath.toSVG();
}

async function generate() {
  const { title, titleSize, taglines, taglineSize } = await extractFromApp();

  // Load the font
  const fontPath = join(process.cwd(), "public/fonts/grandmasterclash.otf");
  // @ts-expect-error The type definition expects 3 args but the function only needs the path
  const font = await load(fontPath);

  // Convert text to paths
  const titlePath = await textToPath(title, 600, 280, titleSize, font);
  const tagline1Path = await textToPath(
    taglines[0],
    600,
    380,
    taglineSize,
    font,
  );
  const tagline2Path = await textToPath(
    taglines[1],
    600,
    440,
    taglineSize,
    font,
  );

  const svgTemplate = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6B21A8" />
        <stop offset="50%" stop-color="#9333EA" />
        <stop offset="100%" stop-color="#3B82F6" />
      </linearGradient>
      <filter id="shadow" x="-20" y="-20" width="1240" height="670">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="black" flood-opacity="0.8" />
        <feDropShadow dx="2" dy="2" stdDeviation="0.5" flood-color="black" flood-opacity="0.9" />
      </filter>
    </defs>

    <rect width="1200" height="630" fill="url(#gradient)" />

    <!-- Title -->
    <g fill="white" filter="url(#shadow)">
      ${titlePath}
    </g>
    
    <!-- Taglines -->
    <g fill="white" opacity="0.9">
      ${tagline1Path}
      ${tagline2Path}
    </g>
  </svg>`;

  // Ensure public directory exists
  const publicDir = join(process.cwd(), "public");
  await mkdir(publicDir, { recursive: true });

  const svgPath = join(publicDir, "og-image.svg");
  const pngPath = join(publicDir, "og-image.png");

  // Remove existing files if they exist
  await Promise.all([rm(svgPath).catch(() => {}), rm(pngPath).catch(() => {})]);

  // Write new files
  await writeFile(svgPath, svgTemplate);
  await sharp(Buffer.from(svgTemplate)).resize(1200, 630).png().toFile(pngPath);

  console.log("✨ Generated og-image.svg and og-image.png");
}

generate().catch(console.error);
