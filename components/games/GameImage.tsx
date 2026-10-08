import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src: string | null | undefined;
  alt?: string;
  /** next/image con `fill`: el contenedor padre necesita ser `relative`. */
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  /** Carga la imagen antes del resto: para la portada del detalle de juego. */
  priority?: boolean;
};
export function GameImage({
  src,
  alt = "",
  fill,
  width,
  height,
  sizes,
  className,
  priority,
}: Props) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        priority={priority}
      />
    );
  }

  return (
    <div
      role="presentation"
      className={cn(
        "flex items-center justify-center bg-[#1C1C1E] text-[#48484A]",
        fill ? "absolute inset-0" : "h-full w-full",
        className,
      )}
    >
      <ImageIcon aria-hidden className="h-1/3 w-1/3" strokeWidth={1.5} />
    </div>
  );
}
