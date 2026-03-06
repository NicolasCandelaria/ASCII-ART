"use client";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  isOver?: boolean;
  hasImage?: boolean;
}

export function DropZone({
  onFileSelect,
  isOver = false,
  hasImage = false,
}: DropZoneProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
    e.target.value = "";
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`
        relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors
        ${isOver ? "border-zinc-500 bg-zinc-800/50" : "border-zinc-600 bg-zinc-900/50 hover:border-zinc-500 hover:bg-zinc-800/30"}
        ${hasImage ? "min-h-[120px]" : ""}
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Upload image"
      />
      {hasImage ? (
        <span className="text-sm text-zinc-400">Drop a new image or click to replace</span>
      ) : (
        <>
          <span className="text-zinc-300">Drop an image here</span>
          <span className="mt-1 text-sm text-zinc-500">or click to browse</span>
        </>
      )}
    </div>
  );
}
