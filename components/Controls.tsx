"use client";

import type { AsciiOptions, Preset } from "@/lib/types";

interface ControlsProps {
  options: AsciiOptions;
  onOptionsChange: (options: AsciiOptions) => void;
  presets: Preset[];
  selectedPresetId: string;
  onPresetSelect: (presetId: string) => void;
}

const OUTPUT_WIDTH_MIN = 40;
const OUTPUT_WIDTH_MAX = 200;
const CONTRAST_MIN = 0.5;
const CONTRAST_MAX = 2;

export function Controls({
  options,
  onOptionsChange,
  presets,
  selectedPresetId,
  onPresetSelect,
}: ControlsProps) {
  const update = (partial: Partial<AsciiOptions>) => {
    onOptionsChange({ ...options, ...partial });
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    onPresetSelect(id);
    const preset = presets.find((p) => p.id === id);
    if (preset) {
      onOptionsChange({
        ...options,
        digitSet: preset.digitSet,
        contrast: preset.contrast,
        invert: preset.invert ?? false,
      });
    }
  };

  return (
    <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Preset
        </label>
        <select
          value={selectedPresetId}
          onChange={handlePresetChange}
          className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          aria-label="Select visual preset"
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Output width: {options.outputWidth}
        </label>
        <input
          type="range"
          min={OUTPUT_WIDTH_MIN}
          max={OUTPUT_WIDTH_MAX}
          value={options.outputWidth}
          onChange={(e) => update({ outputWidth: Number(e.target.value) })}
          className="w-full accent-zinc-400"
          aria-label="Output width in characters"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Contrast: {options.contrast.toFixed(1)}
        </label>
        <input
          type="range"
          min={CONTRAST_MIN}
          max={CONTRAST_MAX}
          step={0.1}
          value={options.contrast}
          onChange={(e) => update({ contrast: Number(e.target.value) })}
          className="w-full accent-zinc-400"
          aria-label="Contrast"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={options.invert}
            onChange={(e) => update({ invert: e.target.checked })}
            className="rounded border-zinc-600 bg-zinc-800 accent-zinc-400"
            aria-label="Invert brightness"
          />
          <span className="text-sm text-zinc-300">Invert</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={options.colorize}
            onChange={(e) => update({ colorize: e.target.checked })}
            className="rounded border-zinc-600 bg-zinc-800 accent-zinc-400"
            aria-label="Colorize output"
          />
          <span className="text-sm text-zinc-300">Color</span>
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Digit set
        </label>
        <input
          type="text"
          value={options.digitSet}
          onChange={(e) => update({ digitSet: e.target.value || "9876543210" })}
          placeholder="9876543210"
          className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 font-mono text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          aria-label="Custom digit set (bright to dark)"
        />
        <p className="mt-1 text-xs text-zinc-500">
          First char = brightest; last = darkest
        </p>
      </div>
    </div>
  );
}
