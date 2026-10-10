import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getManageGames } from "@/lib/api/games";
import { SearchInput } from "@/components/admin/SearchInput";
import { GameImage } from "@/components/games/GameImage";

const PAGE_SIZE = 10;

const StudioGamesPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; q?: string }>;
}) => {
  await requireRole(["VENDEDOR"], "/admin");
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
      <header className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
          Products
        </p>
        <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
          Productos
        </h1>
        <p className="text-sm text-muted-foreground">
          {pageInfo.totalElements} game
          {pageInfo.totalElements !== 1 ? "s" : ""} in your catalog
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput placeholder="Search by name..." paramName="q" />
        <div className="flex items-center gap-3">
          {searchName && (
            <Link
              href="/studio/games"
              className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Limpiar filtro
            </Link>
          )}
          <Link
            href="/studio/games/new"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-muted/50 text-left text-muted-foreground text-xs font-bold uppercase tracking-[0.5px]">
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
                  className="px-3 py-8 text-center text-muted-foreground"
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
                  className="border-t border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">
                    #{g.id}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <div className="relative w-10 h-14 rounded overflow-hidden">
                      <GameImage
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
                      href={`/studio/games/${g.id}`}
                      className="text-foreground hover:underline truncate block"
                    >
                      {g.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                        g.state === "AVAILABLE"
                          ? "bg-muted text-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {g.state}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-foreground whitespace-nowrap">
                    ${g.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    {g.discountPercent > 0 ? (
                      <span className="text-[#26BBFF] text-xs font-semibold whitespace-nowrap">
                        -{g.discountPercent}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/studio/games/${g.id}`}
                        className="text-muted-foreground hover:text-foreground text-sm font-medium"
                      >
                        View
                      </Link>
                      <Link
                        href={`/studio/games/${g.id}/edit`}
                        className="text-muted-foreground hover:text-foreground text-sm font-medium"
                      >
                        Edit
                      </Link>
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
          <span className="text-muted-foreground">
            Showing {start}-{end} of {pageInfo.totalElements}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => {
              const href = searchName
                ? `/studio/games?page=${i}&q=${encodeURIComponent(searchName)}`
                : `/studio/games?page=${i}`;
              return (
                <Link
                  key={i}
                  href={href}
                  className={`size-8 flex items-center justify-center rounded-md text-sm ${
                    i === page
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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

export default StudioGamesPage;
