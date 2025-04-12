import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

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

async function generate() {
  const { title, titleSize, taglines, taglineSize } = await extractFromApp();

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
    <text x="600" y="280" font-family="Grandmaster Clash" font-size="${titleSize}" fill="white" text-anchor="middle" filter="url(#shadow)">
      ${title}
    </text>
    
    <!-- Taglines -->
    <text x="600" y="380" font-family="Grandmaster Clash" font-size="${taglineSize}" fill="white" opacity="0.9" text-anchor="middle">
      ${taglines[0]}
    </text>
    <text x="600" y="440" font-family="Grandmaster Clash" font-size="${taglineSize}" fill="white" opacity="0.9" text-anchor="middle">
      ${taglines[1]}
    </text>
  </svg>`;

  // Ensure public directory exists
  const publicDir = join(process.cwd(), "public");
  await mkdir(publicDir, { recursive: true });

  // Write SVG file
  const svgPath = join(publicDir, "og-image.svg");
  await writeFile(svgPath, svgTemplate);

  // Convert to PNG
  await sharp(Buffer.from(svgTemplate))
    .resize(1200, 630)
    .png()
    .toFile(join(publicDir, "og-image.png"));

  console.log("✨ Generated og-image.svg and og-image.png");
}

generate().catch(console.error);
