import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/actions/admin/guard";
import { getManageGameById, getCategories } from "@/lib/api/games";
import type { Game } from "@/types";
import { GameImage } from "@/components/games/GameImage";
import { GameEditForm } from "./GameEditForm";

const GameDetailPage = async ({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) => {
  await requireRole(["ADMIN"], "/studio/games");
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const game = await getManageGameById(id);
  if (!game) notFound();

  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <BackLink />
      <GameSummary game={game} />
      <GameEditForm game={game} categories={categories} />
    </div>
  );
};

const BackLink = () => (
  <Link
    href="/admin/games"
    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground self-start"
  >
    <ArrowLeft size={16} />
    Back to products
  </Link>
);

const GameSummary = ({ game }: { game: Game }) => (
  <>
    <header className="flex items-center gap-4">
      <div className="relative w-24 h-32 rounded overflow-hidden shrink-0">
        <GameImage
          src={game.imageUrl}
          alt={game.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Edit product</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${
              game.state === "AVAILABLE"
                ? "bg-[#A1CD44] text-black"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {game.state}
          </span>
          <span>#{game.id}</span>
        </div>
      </div>
    </header>
  </>
);

export default GameDetailPage;
