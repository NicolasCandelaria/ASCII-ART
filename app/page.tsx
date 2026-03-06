"use client";

import { useState, useEffect, useCallback } from "react";
import { DropZone } from "@/components/DropZone";
import { Preview } from "@/components/Preview";
import { Controls } from "@/components/Controls";
import { ExportBar } from "@/components/ExportBar";
import type { AsciiOptions, AsciiOutput } from "@/lib/types";
import { imageToAscii } from "@/lib/imageToAscii";
import { PRESETS, DEFAULT_PRESET_ID } from "@/lib/presets";

const DEFAULT_OPTIONS: AsciiOptions = {
  outputWidth: 100,
  contrast: 1,
  invert: false,
  colorize: false,
  digitSet: "9876543210",
};

function getInitialOptions(): AsciiOptions {
  const preset = PRESETS.find((p) => p.id === DEFAULT_PRESET_ID);
  return {
    ...DEFAULT_OPTIONS,
    digitSet: preset?.digitSet ?? DEFAULT_OPTIONS.digitSet,
    contrast: preset?.contrast ?? DEFAULT_OPTIONS.contrast,
    invert: preset?.invert ?? DEFAULT_OPTIONS.invert,
  };
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [options, setOptions] = useState<AsciiOptions>(getInitialOptions);
  const [selectedPresetId, setSelectedPresetId] = useState(DEFAULT_PRESET_ID);
  const [output, setOutput] = useState<AsciiOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback((file: File) => {
    setImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!imageUrl) {
      setOutput(null);
      return;
    }
    let cancelled = false;
    setIsProcessing(true);
    imageToAscii(imageUrl, options)
      .then((result) => {
        if (!cancelled) setOutput(result);
      })
      .catch(() => {
        if (!cancelled) setOutput(null);
      })
      .finally(() => {
        if (!cancelled) setIsProcessing(false);
      });
    return () => {
      cancelled = true;
    };
  }, [imageUrl, options]);

  const selectedPreset = PRESETS.find((p) => p.id === selectedPresetId);
  const presetStyle = selectedPreset
    ? {
        background: selectedPreset.background,
        textColor: selectedPreset.textColor,
        shadow: selectedPreset.shadow,
        glow: selectedPreset.glow,
      }
    : undefined;

  return (
    <main className="min-h-screen p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 md:text-4xl">
          Number ASCII Art
        </h1>
        <p className="mt-2 text-zinc-400">
          Turn images into number-based artwork. Upload or drop an image to start.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <DropZone
            onFileSelect={handleFileSelect}
            hasImage={!!imageUrl}
          />
          {isProcessing && (
            <p className="text-sm text-zinc-500">Processing…</p>
          )}
          <div className="min-h-[200px]">
            <Preview
              text={output?.text ?? ""}
              colors={output?.colors ?? null}
              presetStyle={presetStyle}
            />
          </div>
          <ExportBar
            text={output?.text ?? ""}
            colors={output?.colors ?? null}
            presetStyle={presetStyle}
          />
        </div>
        <aside>
          <Controls
            options={options}
            onOptionsChange={setOptions}
            presets={PRESETS}
            selectedPresetId={selectedPresetId}
            onPresetSelect={setSelectedPresetId}
          />
        </aside>
      </div>
    </main>
  );
}
