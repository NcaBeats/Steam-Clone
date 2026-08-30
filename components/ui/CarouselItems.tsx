import { GameCard } from "../ui";

export const CarouselItems = () => {
  return (
    <div className="overflow-hidden">
      <ul className="overflow-x-auto flex gap-2 snap-x snap-mandatory [&>li]:shrink-0 [&>li]:w-42.5 [&_li]:snap-start">
        <li>
          <GameCard />
        </li>
        <li>
          <GameCard />
        </li>
        <li>
          <GameCard />
        </li>
        <li>
          <GameCard />
        </li>
        <li>
          <GameCard />
        </li>
        <li>
          <GameCard />
        </li>
        <li>
          <GameCard />
        </li>
        <li>
          <GameCard />
        </li>
      </ul>
    </div>
  );
};
