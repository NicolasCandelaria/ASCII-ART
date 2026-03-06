"use client";

interface PreviewProps {
  text: string;
  colors?: string[][] | null;
  presetStyle?: {
    background: string;
    textColor: string;
    shadow?: string;
    glow?: string;
  };
}

export function Preview({
  text,
  colors = null,
  presetStyle,
}: PreviewProps) {
  const bg = presetStyle?.background ?? "#0a0a0a";
  const textColor = presetStyle?.textColor ?? "#fafafa";
  const shadow = presetStyle?.shadow;
  const glow = presetStyle?.glow;

  if (!text) {
    return (
      <div
        className="flex min-h-[200px] items-center justify-center rounded-xl font-mono text-sm text-zinc-500"
        style={{ background: bg }}
      >
        Your number art will appear here
      </div>
    );
  }

  const lines = text.split("\n");
  const hasColors = colors && colors.length > 0 && colors[0].length > 0;

  return (
    <pre
      className="overflow-auto rounded-xl p-4 font-mono text-[0.5rem] font-bold leading-tight md:text-[0.4rem]"
      style={{
        background: bg,
        color: textColor,
        textShadow: [shadow, glow].filter(Boolean).join(", "),
        fontFamily: ' "JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
      }}
    >
      {lines.map((line, rowIndex) => (
        <span key={rowIndex} className="block">
          {hasColors && colors[rowIndex]
            ? line.split("").map((char, colIndex) => (
                <span
                  key={colIndex}
                  style={{
                    color: colors[rowIndex][colIndex] || textColor,
                  }}
                >
                  {char}
                </span>
              ))
            : line}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}
