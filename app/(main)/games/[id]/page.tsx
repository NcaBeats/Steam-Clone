import { getGameById } from "@/lib/api/games";
import { GameDetail } from "@/components/games";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGameById(Number(id));
  return <GameDetail game={game} />;
}
