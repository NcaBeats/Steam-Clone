import { DiscountCarousel } from "@/components/games/CarouselItems";
import type { Game } from "@/types";

type Props = Readonly<{ games: Game[] }>;

export const FreeToPlaySection = ({ games }: Props) => {
  const freeGames = games.filter((g) => g.originalPrice === 0);
  if (freeGames.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h2 className="text-xl text-[#EDEDED] ml-1">Free to Play</h2>
      <DiscountCarousel games={freeGames} />
    </div>
  );
};
