import { GameListItem } from "@/components/ui";
import { getGames } from "@/lib/api";

export const GameList = async () => {
  const games = await getGames();

  return (
    <div className="flex flex-col gap-2">
      {games.map((game) => (
        <GameListItem
          key={game.id}
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
