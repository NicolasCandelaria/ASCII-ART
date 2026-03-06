/**
 * Perceptual brightness (ITU-R BT.709).
 * L = 0.299*R + 0.587*G + 0.114*B
 * Returns value in [0, 1].
 */
export function perceptualBrightness(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Apply contrast in 0–1 space.
 * factor 1 = no change; >1 = more contrast; <1 = less.
 */
export function applyContrast(l: number, factor: number): number {
  return Math.max(0, Math.min(1, (l - 0.5) * factor + 0.5));
}

/**
 * Invert brightness in 0–1 space.
 */
export function applyInvert(l: number): number {
  return 1 - l;
}
