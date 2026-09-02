import { GameCard } from "@/components/games";
import { getDiscountedGames } from "@/lib/api";

export const CarouselItems = async () => {
  const games = await getDiscountedGames();

  return (
    <ul className="overflow-x-auto scrollbar-none flex px-1 py-2 gap-2 snap-x snap-mandatory [&>li]:shrink-0 [&>li]:w-42.5 [&_li]:snap-proximity">
      {games.map((game) => (
        <li className="flex flex-col py-2" key={game.id}>
          <GameCard
            name={game.name}
            price={game.price}
            originalPrice={game.originalPrice}
            discountPercent={game.discountPercent}
            imageUrl={game.imageUrl}
          />
        </li>
      ))}
    </ul>
  );
};
