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
import { cn } from "cn";
import type { GameState } from "@/types";

const PAGE_SIZE = 10;

const GAME_STATES: GameState[] = ["AVAILABLE", "COMING_SOON", "DISCONTINUED"];

const STATE_LABELS: Record<GameState, string> = {
  AVAILABLE: "Available",
  COMING_SOON: "Coming soon",
  DISCONTINUED: "Discontinued",
};

const parseState = (raw: string | undefined): GameState | undefined =>
  GAME_STATES.includes(raw as GameState) ? (raw as GameState) : undefined;

const ALLOWED_SORTS = [
  "id",
  "name",
  "price",
  "originalPrice",
  "discountPercent",
] as const;

const GamesPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{
    page?: string;
    q?: string;
    state?: string;
    sort?: string;
  }>;
}) => {
  await requireRole(["ADMIN"], "/");
  const {
    page: pageParam,
    q,
    state: stateParam,
    sort: sortParam,
  } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const searchName = q?.trim() || undefined;
  const state = parseState(stateParam?.trim());
  const sort = parseSortParam(sortParam?.trim(), ALLOWED_SORTS);

  const data = await getManageGames(page, PAGE_SIZE, searchName, state, sort);
  const { content: games, page: pageInfo } = data;

  const tabs: { value: GameState | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    ...GAME_STATES.map((value) => ({ value, label: STATE_LABELS[value] })),
  ];

  const pageQuery: Record<string, string> = {};
  if (searchName) pageQuery.q = searchName;
  if (state) pageQuery.state = state;
  if (sort) pageQuery.sort = sort;

  const tabHref = (value?: GameState) => {
    const params = new URLSearchParams();
    if (searchName) params.set("q", searchName);
    if (value) params.set("state", value);
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    return qs ? `/admin/games?${qs}` : "/admin/games";
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
            Admin
          </p>
          <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
            Games
          </h1>
          <p className="text-sm text-muted-foreground">
            {pageInfo.totalElements} game
            {pageInfo.totalElements !== 1 ? "s" : ""} in catalog
          </p>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchInput placeholder="Search by name..." paramName="q" />
        {(searchName || state) && (
          <Link
            href="/admin/games"
            className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap"
          >
            Limpiar filtro
          </Link>
        )}
      </div>

      <nav
        aria-label="Filter by state"
        className="inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1"
      >
        {tabs.map((tab) => {
          const isActive = state === tab.value;
          return (
            <Link
              key={tab.label}
              href={tabHref(tab.value)}
              aria-current={isActive || undefined}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <AdminTable>
        <AdminTableHeader
          basePath="/admin/games"
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
            { label: "Actions", className: "w-24 text-right" },
          ]}
        />
        <TableBody>
          {games.length === 0 ? (
            <AdminTableEmpty colSpan={8}>
              {searchName
                ? `No games found matching "${searchName}"`
                : state
                  ? "No games found with this state"
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
                    href={`/admin/games/${g.id}`}
                    className="text-foreground hover:underline truncate block"
                  >
                    {g.name}
                  </Link>
                </TableCell>
                <TableCell className="px-3 py-3 hidden sm:table-cell">
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
                <TableCell className="px-3 py-3">
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
                  <RowActions kind="game" id={g.id} label={g.name} />
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
        basePath="/admin/games"
        query={Object.keys(pageQuery).length > 0 ? pageQuery : undefined}
      />
    </div>
  );
};

export default GamesPage;
