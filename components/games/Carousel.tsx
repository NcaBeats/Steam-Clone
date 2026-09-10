"use client";

import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Game } from "@/types";

interface BannerCarouselProps {
  readonly games: Game[];
}

export const BannerCarousel = ({ games }: BannerCarouselProps) => {
  if (games.length === 0) return null;

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 5000 })]}
      className="w-full"
    >
      <CarouselContent>
        {games.map((game) => (
          <CarouselItem key={game.id}>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Link href={`/games/${game.id}`}>
                <Image
                  src={game.bannerUrl!}
                  alt={game.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 text-white border-none rounded-full size-10" />
      <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 text-white border-none rounded-full size-10" />
    </Carousel>
  );
};
