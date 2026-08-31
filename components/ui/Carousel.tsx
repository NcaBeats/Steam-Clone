"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Carousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  return (
    <div className="relative overflow-hidden rounded-lg cursor-pointer">
      <div ref={emblaRef}>
        <div className="flex">
          <div className="min-w-full relative aspect-video">
            <Image src="/images/RL.webp" alt="" fill className="object-cover" />
          </div>
          <div className="min-w-full relative aspect-video">
            <Image
              src="/images/Spiderman.avif"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-full relative aspect-video">
            <Image
              src="/images/gta5.webp"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-full relative aspect-video">
            <Image
              src="/images/bf1.webp"
              alt=""
              fill
              className="object-cover"
            />
          </div>
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
