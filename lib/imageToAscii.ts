import type { AsciiOptions, AsciiOutput } from "./types";
import { perceptualBrightness, applyContrast, applyInvert } from "./brightness";
import { getDigit } from "./characterMap";

const CHAR_ASPECT = 0.5; // monospace char height/width ~ 0.5

function rgbToHex(r: number, g: number, b: number): string {
  const rr = Math.round(Math.max(0, Math.min(255, r)));
  const gg = Math.round(Math.max(0, Math.min(255, g)));
  const bb = Math.round(Math.max(0, Math.min(255, b)));
  return `#${rr.toString(16).padStart(2, "0")}${gg.toString(16).padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`;
}

/**
 * Load image from URL and resolve with the loaded HTMLImageElement.
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

/**
 * Convert image at URL to number-based ASCII art.
 * Uses a hidden canvas for block sampling; aspect ratio corrected for monospace.
 */
export async function imageToAscii(
  imageUrl: string,
  options: AsciiOptions
): Promise<AsciiOutput> {
  const img = await loadImage(imageUrl);
  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;

  const cols = Math.max(1, Math.min(200, options.outputWidth));
  const rows = Math.max(
    1,
    Math.floor(cols * (naturalH / naturalW) * CHAR_ASPECT)
  );

  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2d context");

  ctx.drawImage(img, 0, 0, cols, rows);
  const imageData = ctx.getImageData(0, 0, cols, rows);
  const data = imageData.data;

  const digitSet = options.digitSet || "9876543210";
  const lines: string[] = [];
  const colorGrid: string[][] = [];

  for (let y = 0; y < rows; y++) {
    const lineChars: string[] = [];
    const colorRow: string[] = [];
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      let l = perceptualBrightness(r, g, b);
      l = applyContrast(l, options.contrast);
      if (options.invert) l = applyInvert(l);

      const char = getDigit(l, digitSet);
      lineChars.push(char);
      if (options.colorize) {
        colorRow.push(rgbToHex(r, g, b));
      } else {
        colorRow.push("");
      }
    }
    lines.push(lineChars.join(""));
    colorGrid.push(colorRow);
  }

  return {
    text: lines.join("\n"),
    colors: options.colorize ? colorGrid : null,
  };
}
