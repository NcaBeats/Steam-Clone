import { DiscountCarousel } from "@/components/games/CarouselItems";
import type { Game } from "@/types";

type Props = Readonly<{ games: Game[] }>;

export const ComingSoonSection = ({ games }: Props) => {
  const comingSoon = games.filter((g) => g.state === "COMING_SOON");
  if (comingSoon.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h2 className="text-xl text-[#EDEDED] ml-1">Coming Soon</h2>
      <DiscountCarousel games={comingSoon} />
    </div>
  );
};
