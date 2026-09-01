"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Game } from "@/types";

interface CarouselProps {
  readonly games: Game[];
}

export const Carousel = ({ games }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  if (games.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-lg cursor-pointer">
      <div ref={emblaRef}>
        <div className="flex">
          {games.map((game) => (
            <div className="min-w-full relative aspect-video" key={game.id}>
              <Image
                src={game.bannerUrl!}
                alt={game.name}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white cursor-pointer transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white cursor-pointer transition-colors"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
