"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GameCard } from "@/components/games/GameCard";
import type { Game } from "@/types";

interface DiscountCarouselProps {
  readonly games: Game[];
}

export const DiscountCarousel = ({ games }: DiscountCarouselProps) => {
  if (games.length === 0) return null;

  return (
    <Carousel opts={{ dragFree: true }} className="w-full">
      <CarouselContent className="touch-manipulation">
        {games.map((game) => (
          <CarouselItem
            key={game.id}
            className="sm:basis-1/6 basis-1/2 py-2 px-1 pl-4"
          >
            <GameCard
              id={game.id}
              name={game.name}
              price={game.price}
              originalPrice={game.originalPrice}
              discountPercent={game.discountPercent}
              imageUrl={game.imageUrl}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
};
