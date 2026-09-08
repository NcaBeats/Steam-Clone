import Link from "next/link";
import Image from "next/image";
import { requireRole } from "@/actions/admin/guard";
import { getManageGames } from "@/lib/api/games";
import { deleteGameAction } from "@/actions/admin";
import { revalidatePath } from "next/cache";
import { SearchInput } from "@/components/admin/SearchInput";

const PAGE_SIZE = 10;

const GamesPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; q?: string }>;
}) => {
  await requireRole(["ADMIN"], "/studio/games");
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const offset = page * PAGE_SIZE;
  const searchName = q?.trim() || undefined;

  const data = await getManageGames(page, PAGE_SIZE, searchName);
  const { content: games, page: pageInfo } = data;
  const totalPages = pageInfo.totalPages;
  const start = pageInfo.totalElements === 0 ? 0 : offset + 1;
  const end = Math.min(offset + PAGE_SIZE, pageInfo.totalElements);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]">
            Products
          </p>
          <h1 className="text-xl font-bold tracking-[0.4px] text-[#FAFAFA]">
            Productos
          </h1>
          <p className="text-sm text-[#8A8A8A]">
            {pageInfo.totalElements} game
            {pageInfo.totalElements !== 1 ? "s" : ""} in catalog
          </p>
        </div>
        <Link
          href="/admin/games/new"
          className="bg-[#28282C] hover:bg-[#404044] text-[#FAFAFA] text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          + Nuevo producto
        </Link>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput placeholder="Buscar por nombre..." paramName="q" />
        {searchName && (
          <Link
            href="/admin/games"
            className="text-sm text-[#8A8A8A] hover:text-white whitespace-nowrap"
          >
            Limpiar filtro
          </Link>
        )}
      </div>

      <div className="bg-[#202024] border border-white/[0.06] rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-[#18181C] text-left text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px]">
              <th className="px-3 py-3 w-16 hidden md:table-cell">ID</th>
              <th className="px-3 py-3 w-12 hidden sm:table-cell">Cover</th>
              <th className="px-3 py-3">Name</th>
              <th className="px-3 py-3 w-24 hidden sm:table-cell">State</th>
              <th className="px-3 py-3 w-24">Price</th>
              <th className="px-3 py-3 w-20 hidden sm:table-cell">Discount</th>
              <th className="px-3 py-3 w-36 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-[#8A8A8A]"
                >
                  {searchName
                    ? `No games found matching "${searchName}"`
                    : "No games found"}
                </td>
              </tr>
            ) : (
              games.map((g) => (
                <tr
                  key={g.id}
                  className="border-t border-white/[0.06] hover:bg-[#28282C] transition-colors"
                >
                  <td className="px-3 py-3 text-[#8A8A8A] hidden md:table-cell">
                    #{g.id}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <div className="relative w-10 h-14 rounded overflow-hidden">
                      <Image
                        src={g.imageUrl}
                        alt={g.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/games/${g.id}`}
                      className="text-[#007AFF] hover:underline truncate block"
                    >
                      {g.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                        g.state === "AVAILABLE"
                          ? "bg-[#28282C] text-[#FAFAFA]"
                          : "bg-[#101014] text-[#8A8A8A]"
                      }`}
                    >
                      {g.state}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#FAFAFA] whitespace-nowrap">
                    ${g.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    {g.discountPercent > 0 ? (
                      <span className="text-[#26BBFF] text-xs font-semibold whitespace-nowrap">
                        -{g.discountPercent}%
                      </span>
                    ) : (
                      <span className="text-[#5A5A5A] text-xs whitespace-nowrap">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/games/${g.id}`}
                        className="text-[#007AFF] hover:text-[#1ea4ff] text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteGameButton id={g.id} name={g.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-[#8A8A8A]">
            Showing {start}-{end} of {pageInfo.totalElements}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => {
              const href = searchName
                ? `/admin/games?page=${i}&q=${encodeURIComponent(searchName)}`
                : `/admin/games?page=${i}`;
              return (
                <Link
                  key={i}
                  href={href}
                  className={`size-8 flex items-center justify-center rounded-md text-sm ${
                    i === page
                      ? "bg-[#28282C] text-white"
                      : "text-[#8A8A8A] hover:bg-[#28282C] hover:text-white"
                  }`}
                >
                  {i + 1}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

const DeleteGameButton = ({ id, name }: { id: number; name: string }) => {
  return (
    <form
      action={async () => {
        "use server";
        await deleteGameAction(id);
        revalidatePath("/admin/games");
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-[#FF6B6B] hover:text-red-400 text-sm font-medium"
        aria-label={`Delete game ${name}`}
      >
        Delete
      </button>
    </form>
  );
};

export default GamesPage;
