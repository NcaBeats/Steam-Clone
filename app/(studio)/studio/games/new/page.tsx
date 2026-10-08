import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getCategories } from "@/lib/api/games";
import { NewGameForm } from "@/components/studio/NewGameForm";

const StudioNewGamePage = async () => {
  await requireRole(["VENDEDOR"], "/admin");
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <header className="flex flex-col gap-1">
        <Link
          href="/studio/games"
          className="text-sm text-[#8A8A8A] hover:text-white self-start"
        >
          ← Back to products
        </Link>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">New product</h1>
        <p className="text-sm text-[#8A8A8A]">
          Create a game. It will be assigned automatically to your seller
          account.
        </p>
      </header>

      <NewGameForm categories={categories} redirectTo="/studio/games" />
    </div>
  );
};

export default StudioNewGamePage;
