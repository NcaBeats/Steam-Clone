import { GameListItem } from "@/components/games";
import type { Game } from "@/types";

type Props = Readonly<{ games: Game[] }>;

export const CatalogList = ({ games }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {games.map((game) => (
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
