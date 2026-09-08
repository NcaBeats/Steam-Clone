"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, VideoIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

type DropzoneKind = "image" | "banner" | "video" | "gallery";

type FileDropzoneProps = {
  kind: DropzoneKind;
  value: File | File[] | null;
  onChange: (file: File | File[] | null) => void;
  required?: boolean;
  maxFiles?: number;
  // URL of the currently stored asset (shown as preview when no new file is picked)
  existingUrl?: string | null;
  existingPreview?: string | null; // for videos: any mp4/webm URL
  className?: string;
};

const KIND_CONFIG = {
  image: {
    label: "Imagen principal",
    hint: "PNG, JPG, WEBP o AVIF · máx 10MB",
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    icon: ImageIcon,
  },
  banner: {
    label: "Banner",
    hint: "PNG, JPG, WEBP o AVIF · máx 10MB",
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif"] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    icon: ImageIcon,
  },
  video: {
    label: "Trailer (video)",
    hint: "MP4, WEBM o MOV · máx 300MB",
    accept: { "video/*": [".mp4", ".webm", ".mov"] },
    maxSize: 300 * 1024 * 1024,
    multiple: false,
    icon: VideoIcon,
  },
  gallery: {
    label: "Galería de imágenes",
    hint: "PNG, JPG, WEBP o AVIF · hasta 10 archivos · máx 10MB c/u",
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif"] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    icon: ImageIcon,
  },
} as const;

function toMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(1);
}

function formatName(name: string): string {
  return name.length > 40 ? `${name.slice(0, 37)}...` : name;
}

export function FileDropzone({
  kind,
  value,
  onChange,
  required = false,
  maxFiles = 10,
  existingUrl = null,
  existingPreview,
  className,
}: FileDropzoneProps) {
  const cfg = KIND_CONFIG[kind];
  const [error, setError] = useState<string | null>(null);

  const files = Array.isArray(value) ? value : value ? [value] : [];
  const hasNewFile = files.length > 0;
  const currentPreview =
    hasNewFile && !Array.isArray(value)
      ? URL.createObjectURL(files[0] as File)
      : null;

  useEffect(() => {
    return () => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
    };
  }, [currentPreview]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (cfg.multiple) {
        const merged = [...files, ...accepted].slice(0, maxFiles);
        onChange(merged.length > 0 ? merged : null);
      } else {
        onChange(accepted[0] ?? null);
      }
      setError(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg.multiple, maxFiles, onChange],
  );

  const onRejected = useCallback(
    (rejections: unknown) => {
      const first = Array.isArray(rejections) ? rejections[0] : null;
      const code = first?.errors?.[0]?.code as string | undefined;
      if (code === "file-too-large") {
        setError(
          `El archivo supera el tamaño máximo permitido (${toMB(cfg.maxSize)}MB).`,
        );
      } else if (code === "file-invalid-type") {
        setError("Tipo de archivo no permitido en este campo.");
      } else if (code === "too-many-files") {
        setError(`Máximo ${maxFiles} archivos permitidos.`);
      } else {
        setError("No se pudo agregar el archivo.");
      }
    },
    [cfg.maxSize, maxFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: cfg.accept,
    maxSize: cfg.maxSize,
    multiple: cfg.multiple,
    onDrop,
    onDropRejected: onRejected,
  });

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : null);
  };

  const previewUrl =
    hasNewFile && files.length === 1 && currentPreview
      ? currentPreview
      : kind !== "gallery"
        ? (existingPreview ?? existingUrl)
        : null;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs text-[#8A8A8A] font-medium flex items-center gap-1">
        {cfg.label}
        {required && <span className="text-[#007AFF]">*</span>}
        <span className="text-[#5A5A5A] font-normal">· {cfg.hint}</span>
      </span>

      {previewUrl && kind === "image" && (
        <div className="relative w-32 h-44 rounded-lg border border-[#2A2A2A] overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {previewUrl && kind === "banner" && (
        <div className="relative w-full aspect-[8/2.5] rounded-lg border border-[#2A2A2A] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Vista previa banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {previewUrl && kind === "video" && (
        <video
          src={previewUrl}
          controls
          className="w-full aspect-video rounded-lg border border-[#2A2A2A] bg-black"
        />
      )}

      {kind === "gallery" && hasNewFile && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-lg border border-[#2A2A2A] overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-0.5 right-0.5 size-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                aria-label="Quitar archivo"
              >
                <X size={12} />
              </button>
              <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[10px] text-white truncate px-1">
                {formatName(file.name)}
              </span>
            </div>
          ))}
        </div>
      )}
      {kind === "gallery" && !hasNewFile && (
        <div className={cn("flex flex-wrap gap-2", existingUrl && "hidden")}>
          {/* placeholders omitted; dropzone covers picker */}
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#2A2A2A] bg-[#101010] px-4 py-5 text-sm text-[#8A8A8A] cursor-pointer transition-colors hover:border-[#007AFF] hover:text-[#FAFAFA]",
          isDragActive && "border-[#007AFF] text-[#FAFAFA] bg-[#14212e]",
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud
          size={18}
          className={isDragActive ? "text-[#007AFF]" : ""}
        />
        {isDragActive
          ? "Suelta los archivos aquí"
          : hasNewFile
            ? "Reemplazar archivo"
            : "Arrastra y suelta o haz clic para seleccionar"}
      </div>

      {error && <p className="text-xs text-[#FF6B6B]">{error}</p>}
    </div>
  );
}
