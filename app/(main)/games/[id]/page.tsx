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

  if (Number.isNaN(gameId)) {
    notFound();
  }

  const [gameResult, libraryResult] = await Promise.allSettled([
    getGameById(gameId),
    getMyLibraryAction(),
  ]);

  if (gameResult.status === "rejected") {
    const error = gameResult.reason;
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const game = gameResult.value;

  let library: Awaited<ReturnType<typeof getMyLibraryAction>> = [];
  if (libraryResult.status === "fulfilled") {
    library = libraryResult.value;
  } else {
    console.error("[getGamePage] library lookup failed:", libraryResult.reason);
  }

  const alreadyInLibrary = library.some((item) => item.gameId === gameId);

  return <GameDetail game={game} initialInLibrary={alreadyInLibrary} />;
}
