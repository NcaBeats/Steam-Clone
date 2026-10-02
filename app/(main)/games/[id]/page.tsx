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
  try {
    game = await getGameById(gameId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  // El estado de biblioteca es un dato adjunto, no el motivo de la pagina: si
  // falla, se muestra el juego igual y se deja el boton en su estado inicial.
  // Se degrada a proposito, pero sin tragarse el error en silencio.
  const library = await getMyLibraryAction().catch((error: unknown) => {
    console.error("[getGamePage] library lookup failed:", error);
    return [];
  });

  const alreadyInLibrary = library.some((item) => item.gameId === gameId);

  return <GameDetail game={game} initialInLibrary={alreadyInLibrary} />;
}
