import { DiscountCarousel } from "@/components/games/CarouselItems";
import type { Game } from "@/types";

type Props = Readonly<{
  games: Game[];
  categoriesToShow: string[];
}>;

export const CategoryCarouselsGrid = ({ games, categoriesToShow }: Props) => {
  const filtered = games.filter((g) =>
    g.categories.some((c) => categoriesToShow.includes(c.name)),
  );

  const byCategory = new Map<string, Game[]>();
  for (const cat of categoriesToShow) {
    const list = filtered.filter((g) =>
      g.categories.some((c) => c.name === cat),
    );
    if (list.length > 0) {
      byCategory.set(cat, list);
    }
  }

  if (byCategory.size === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {Array.from(byCategory.entries()).map(([cat, list]) => (
        <div
          key={cat}
          id={`category-${cat}`}
          className="flex flex-col scroll-mt-20"
        >
          <h2 className="text-xl text-[#EDEDED] ml-1">{cat}</h2>
          <DiscountCarousel games={list} />
        </div>
      ))}
    </div>
  );
};
