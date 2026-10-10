import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getManageGames } from "@/lib/api/games";
import { SearchInput } from "@/components/admin/SearchInput";
import { GameImage } from "@/components/games/GameImage";
import {
  AdminTable,
  AdminTableEmpty,
  AdminTableHeader,
  AdminTablePagination,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/admin/dashboard/admin-table";

const PAGE_SIZE = 10;

const StudioGamesPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; q?: string }>;
}) => {
  await requireRole(["VENDEDOR"], "/admin");
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const searchName = q?.trim() || undefined;

  const data = await getManageGames(page, PAGE_SIZE, searchName);
  const { content: games, page: pageInfo } = data;

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

      <AdminTable>
        <AdminTableHeader
          columns={[
            { label: "ID", className: "w-16 hidden md:table-cell" },
            { label: "Cover", className: "w-12 hidden sm:table-cell" },
            { label: "Name" },
            { label: "State", className: "w-36 hidden sm:table-cell" },
            { label: "Price", className: "w-20 sm:w-24" },
            { label: "Discount", className: "w-24 hidden sm:table-cell" },
            { label: "Actions", className: "w-36 text-right" },
          ]}
        />
        <TableBody>
          {games.length === 0 ? (
            <AdminTableEmpty colSpan={7}>
              {searchName
                ? `No games found matching "${searchName}"`
                : "No games found"}
            </AdminTableEmpty>
          ) : (
            games.map((g) => (
              <TableRow key={g.id}>
                <TableCell className="px-3 py-3 text-muted-foreground hidden md:table-cell">
                  #{g.id}
                </TableCell>
                <TableCell className="px-3 py-3 hidden sm:table-cell">
                  <div className="relative w-10 h-14 rounded overflow-hidden">
                    <GameImage
                      src={g.imageUrl}
                      alt={g.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </TableCell>
                <TableCell className="px-3 py-3 whitespace-normal">
                  <Link
                    href={`/studio/games/${g.id}`}
                    className="text-foreground hover:underline truncate block"
                  >
                    {g.name}
                  </Link>
                </TableCell>
                <TableCell className="px-3 py-3 hidden sm:table-cell whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-semibold inline-block ${
                      g.state === "AVAILABLE"
                        ? "bg-muted text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {g.state}
                  </span>
                </TableCell>
                <TableCell className="px-3 py-3 text-foreground whitespace-nowrap">
                  ${g.price.toFixed(2)}
                </TableCell>
                <TableCell className="px-3 py-3 hidden sm:table-cell">
                  {g.discountPercent > 0 ? (
                    <span className="text-[#26BBFF] font-semibold whitespace-nowrap">
                      -{g.discountPercent}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground whitespace-nowrap">
                      —
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-3 py-3 text-right whitespace-nowrap">
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </AdminTable>

      <AdminTablePagination
        page={page}
        totalPages={pageInfo.totalPages}
        totalElements={pageInfo.totalElements}
        pageSize={PAGE_SIZE}
        basePath="/studio/games"
        query={searchName ? { q: searchName } : undefined}
      />
    </div>
  );
};

export default StudioGamesPage;
