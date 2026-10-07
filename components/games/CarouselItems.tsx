"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/media/carousel";
import { GameCard } from "@/components/games/GameCard";
import { GameCardBig } from "@/components/games/GameCardBig";
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

export const DiscountCarouselFeatured = ({ games }: DiscountCarouselProps) => {
  if (games.length === 0) return null;

  return (
    <Carousel opts={{ dragFree: true, align: "start" }} className="w-full">
      <CarouselContent className="touch-manipulation -ml-2 md:-ml-4">
        {games.map((game) => (
          <CarouselItem
            key={game.id}
            className="basis-1/2 sm:basis-1/2 md:basis-1/4 pl-2 md:pl-4 py-2"
          >
            <GameCardBig
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
