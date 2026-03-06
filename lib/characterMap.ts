/**
 * Map brightness [0, 1] to digit index in [0, digitSetLength - 1].
 */
export function brightnessToDigitIndex(
  brightness: number,
  digitSetLength: number
): number {
  if (digitSetLength <= 0) return 0;
  const index = Math.floor(brightness * digitSetLength);
  return Math.max(0, Math.min(digitSetLength - 1, index));
}

/**
 * Get the digit character for a given brightness [0, 1] and digit set.
 */
export function getDigit(brightness: number, digitSet: string): string {
  if (!digitSet.length) return " ";
  const index = brightnessToDigitIndex(brightness, digitSet.length);
  return digitSet[index] ?? " ";
}
