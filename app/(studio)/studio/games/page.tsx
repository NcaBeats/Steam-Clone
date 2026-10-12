import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getManageGames } from "@/lib/api/games";
import { SearchInput } from "@/components/admin/SearchInput";
import { RowActions } from "@/components/admin/dashboard/row-actions";
import { GameImage } from "@/components/games/GameImage";
import { DiscountBadge, GameStateBadge } from "@/components/games/GameBadges";
import {
  AdminTable,
  AdminTableActions,
  AdminTableEmpty,
  AdminTableHeader,
  AdminTablePagination,
  TableBody,
  TableCell,
  TableRow,
  parseSortParam,
} from "@/components/admin/dashboard/admin-table";

const PAGE_SIZE = 10;

const ALLOWED_SORTS = [
  "id",
  "name",
  "price",
  "originalPrice",
  "discountPercent",
] as const;

const StudioGamesPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) => {
  await requireRole(["VENDEDOR"], "/admin");
  const { page: pageParam, q, sort: sortParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const searchName = q?.trim() || undefined;
  const sort = parseSortParam(sortParam?.trim(), ALLOWED_SORTS);

  const data = await getManageGames(
    page,
    PAGE_SIZE,
    searchName,
    undefined,
    sort,
  );
  const { content: games, page: pageInfo } = data;

  const pageQuery: Record<string, string> = {};
  if (searchName) pageQuery.q = searchName;
  if (sort) pageQuery.sort = sort;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
          Studio
        </p>
        <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
          Games
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
          basePath="/studio/games"
          query={pageQuery}
          sort={sort}
          columns={[
            {
              label: "ID",
              className: "w-16 hidden md:table-cell",
              sortKey: "id",
            },
            { label: "Cover", className: "w-12 hidden sm:table-cell" },
            { label: "Name", sortKey: "name" },
            { label: "State", className: "w-36 hidden sm:table-cell" },
            {
              label: "Original",
              className: "w-24 hidden sm:table-cell",
              sortKey: "originalPrice",
            },
            { label: "Price", className: "w-20 sm:w-24", sortKey: "price" },
            {
              label: "Discount",
              className: "w-24 hidden sm:table-cell",
              sortKey: "discountPercent",
            },
            { label: "Actions", className: "w-36 text-right" },
          ]}
        />
        <TableBody>
          {games.length === 0 ? (
            <AdminTableEmpty colSpan={8}>
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
                  <GameStateBadge state={g.state} />
                </TableCell>
                <TableCell className="px-3 py-3 hidden sm:table-cell whitespace-nowrap">
                  {g.discountPercent > 0 ? (
                    <s className="text-muted-foreground line-through">
                      ${g.originalPrice.toFixed(2)}
                    </s>
                  ) : (
                    <span className="text-muted-foreground">
                      ${g.originalPrice.toFixed(2)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="px-3 py-3 text-foreground whitespace-nowrap">
                  ${g.price.toFixed(2)}
                </TableCell>
                <TableCell className="px-3 py-3 hidden sm:table-cell">
                  {g.discountPercent > 0 ? (
                    <DiscountBadge percent={g.discountPercent} />
                  ) : (
                    <span className="text-muted-foreground whitespace-nowrap">
                      —
                    </span>
                  )}
                </TableCell>
                <AdminTableActions>
                  <RowActions kind="studio-game" id={g.id} label={g.name} />
                </AdminTableActions>
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
        query={Object.keys(pageQuery).length > 0 ? pageQuery : undefined}
      />
    </div>
  );
};

export default StudioGamesPage;
