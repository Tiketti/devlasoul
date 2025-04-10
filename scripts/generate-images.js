import sharp from "sharp";
import fs from "node:fs/promises";

async function convertSvgToPng(inputPath, outputPath, width, height) {
  const svg = await fs.readFile(inputPath, "utf-8");
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(outputPath);
}

async function main() {
  // Generate favicon.png
  await convertSvgToPng("public/favicon.svg", "public/favicon.png", 32, 32);

  // Generate apple-touch-icon.png
  await convertSvgToPng(
    "public/favicon.svg",
    "public/apple-touch-icon.png",
    180,
    180,
  );

  // Generate og-image.png
  await convertSvgToPng(
    "public/og-image.svg",
    "public/og-image.png",
    1200,
    630,
  );

  console.log("✨ Generated all images successfully!");
}

main().catch(console.error);
