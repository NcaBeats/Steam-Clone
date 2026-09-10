import { getGameById } from "@/lib/api/games";
import { getMyLibraryAction } from "@/actions/library";
import { GameDetail } from "@/components/games";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/errors";

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);

  let game;
  let library;
  try {
    [game, library] = await Promise.all([
      getGameById(gameId),
      getMyLibraryAction(),
    ]);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const alreadyInLibrary = library.some((item) => item.gameId === gameId);

  return <GameDetail game={game} initialInLibrary={alreadyInLibrary} />;
}
