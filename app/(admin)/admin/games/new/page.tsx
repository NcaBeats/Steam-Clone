import Link from "next/link";
import { requireAdmin } from "@/actions/admin/guard";
import { getCategories } from "@/lib/api/games";
import { NewGameForm } from "./NewGameForm";

const NewGamePage = async () => {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <header className="flex flex-col gap-1">
        <Link
          href="/admin/games"
          className="text-sm text-[#8A8A8A] hover:text-white self-start"
        >
          ← Back to products
        </Link>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">New product</h1>
        <p className="text-sm text-[#8A8A8A]">
          Create a new game entry. You can upload images afterwards from the
          edit page.
        </p>
      </header>

      <NewGameForm categories={categories} />
    </div>
  );
};

export default NewGamePage;
