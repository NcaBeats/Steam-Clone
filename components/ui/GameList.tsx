import { GameListItem } from "../ui";

export const GameList = () => {
  return (
    <div className="flex flex-col gap-2">
      <GameListItem />
      <GameListItem />
      <GameListItem />
      <GameListItem />
    </div>
  );
};
