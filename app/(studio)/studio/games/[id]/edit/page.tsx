import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/actions/admin/guard";
import { getCategories, getManageGameById } from "@/lib/api/games";
import { GameEditForm } from "@/components/studio/GameEditForm";

const StudioEditGamePage = async ({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) => {
  await requireRole(["VENDEDOR"], "/admin");
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const [game, categories] = await Promise.all([
    getManageGameById(id),
    getCategories(),
  ]);
  if (!game) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <header className="flex flex-col gap-1">
        <Link
          href={`/studio/games/${id}`}
          className="text-sm text-[#8A8A8A] hover:text-white self-start"
        >
          ← Back to product
        </Link>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">Edit product</h1>
        <p className="text-sm text-[#8A8A8A]">
          Update the data and, if you wish, replace the media assets.
        </p>
      </header>

      <GameEditForm
        game={game}
        categories={categories}
        redirectTo={`/studio/games/${id}`}
      />
    </div>
  );
};

export default StudioEditGamePage;
