import { DiscountCarousel } from "@/components/games/CarouselItems";
import type { Game } from "@/types";

type Props = Readonly<{ games: Game[] }>;

export const ComingSoonSection = ({ games }: Props) => {
  if (games.length === 0) return null;

  return (
    <section className="flex flex-col">
      <DiscountCarousel games={games} title="Coming Soon" />
    </section>
  );
};
