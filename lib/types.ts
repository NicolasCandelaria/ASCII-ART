export interface AsciiOptions {
  outputWidth: number; // character columns (e.g. 80–200)
  contrast: number; // 0.5–2
  invert: boolean;
  colorize: boolean;
  digitSet: string; // e.g. "9876543210"
}

export interface Preset {
  id: string;
  name: string;
  background: string; // CSS color
  textColor: string; // default text color (monochrome)
  digitSet: string;
  contrast: number;
  invert?: boolean;
  shadow?: string; // e.g. "0 0 20px rgba(0,255,0,0.5)"
  glow?: string;
}

export interface AsciiOutput {
  text: string; // full string with \n
  colors: string[][] | null; // [row][col] hex color, or null if monochrome
}
