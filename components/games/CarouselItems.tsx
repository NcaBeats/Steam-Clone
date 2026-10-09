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
  readonly title?: string;
  readonly titleClassName?: string;
}

const DEFAULT_TITLE_CLASS = "text-xl text-[#EDEDED] ml-1";

export const DiscountCarousel = ({
  games,
  title,
  titleClassName = DEFAULT_TITLE_CLASS,
}: DiscountCarouselProps) => {
  if (games.length === 0) return null;

  return (
    <Carousel opts={{ dragFree: true }} className="w-full">
      {title ? (
        <div className="mb-2 flex items-center justify-between">
          <h2 className={titleClassName}>{title}</h2>
          <div className="flex gap-2">
            <CarouselPrevious className="static left-auto right-auto top-auto my-0 size-8" />
            <CarouselNext className="static left-auto right-auto top-auto my-0 size-8" />
          </div>
        </div>
      ) : null}
      <CarouselContent className="touch-manipulation">
        {games.map((game) => (
          <CarouselItem
            key={game.id}
            className="basis-1/2 sm:basis-1/6 py-2 pr-1"
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
      {!title ? (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      ) : null}
    </Carousel>
  );
};

export const DiscountCarouselFeatured = ({
  games,
  title,
  titleClassName = DEFAULT_TITLE_CLASS,
}: DiscountCarouselProps) => {
  if (games.length === 0) return null;

  return (
    <Carousel opts={{ dragFree: true, align: "start" }} className="w-full">
      {title ? (
        <div className="mb-2 flex items-center justify-between">
          <h2 className={titleClassName}>{title}</h2>
          <div className="flex gap-2">
            <CarouselPrevious className="static left-auto right-auto top-auto my-0 size-8" />
            <CarouselNext className="static left-auto right-auto top-auto my-0 size-8" />
          </div>
        </div>
      ) : null}
      <CarouselContent className="touch-manipulation -ml-2 md:-ml-4">
        {games.map((game) => (
          <CarouselItem
            key={game.id}
            className="basis-1/2 md:basis-1/4 pl-2 md:pl-4 py-2"
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
      {!title ? (
        <>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </>
      ) : null}
    </Carousel>
  );
};
