import { GameListItem } from "@/components/games";
import { getGames } from "@/lib/api";
import type { Game } from "@/types";

type Props = Readonly<{ games?: Game[] }>;

export const CatalogList = async ({ games }: Props = {}) => {
  const list = games ?? (await getGames());

  return (
    <div className="flex flex-col gap-2">
      {list.map((game) => (
        <GameListItem
          key={game.id}
          id={game.id}
          name={game.name}
          price={game.price}
          categories={game.categories}
          launchDate={game.launchDate}
          imageUrl={game.imageUrl}
        />
      ))}
    </div>
  );
};
