"use client";

interface ExportBarProps {
  text: string;
  colors?: string[][] | null;
  presetStyle?: {
    background: string;
    textColor: string;
    shadow?: string;
    glow?: string;
  };
}

const PREVIEW_FONT = '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace';
const PREVIEW_FONT_SIZE_PX = 8;

export function ExportBar({
  text,
  colors = null,
  presetStyle,
}: ExportBarProps) {
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback or ignore
    }
  };

  const handleDownloadPng = () => {
    if (!text) return;
    const lines = text.split("\n");
    const cols = lines[0]?.length ?? 0;
    const rows = lines.length;
    const charW = PREVIEW_FONT_SIZE_PX * 0.6;
    const charH = PREVIEW_FONT_SIZE_PX * 1.2;
    const padding = 24;
    const width = Math.ceil(cols * charW + padding * 2);
    const height = Math.ceil(rows * charH + padding * 2);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bg = presetStyle?.background ?? "#0a0a0a";
    const textColor = presetStyle?.textColor ?? "#fafafa";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.font = `bold ${PREVIEW_FONT_SIZE_PX}px ${PREVIEW_FONT}`;
    ctx.textBaseline = "top";
    const hasColors = colors && colors.length > 0 && colors[0].length > 0;

    for (let y = 0; y < rows; y++) {
      const line = lines[y] ?? "";
      for (let x = 0; x < line.length; x++) {
        const char = line[x];
        const px = padding + x * charW;
        const py = padding + y * charH;
        ctx.fillStyle = hasColors && colors[y]?.[x] ? colors[y][x] : textColor;
        ctx.fillText(char, px, py);
      }
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ascii-art.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  const disabled = !text;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Copy text to clipboard"
      >
        Copy text
      </button>
      <button
        type="button"
        onClick={handleDownloadPng}
        disabled={disabled}
        className="rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Download as PNG"
      >
        Download PNG
      </button>
    </div>
  );
}
