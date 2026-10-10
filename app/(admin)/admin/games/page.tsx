import Link from "next/link";
import { TicketIcon } from "lucide-react";
import { requireRole } from "@/actions/admin/guard";
import { getManageGames } from "@/lib/api/games";
import { SearchInput } from "@/components/admin/SearchInput";
import { RowActions } from "@/components/admin/dashboard/row-actions";
import { GameImage } from "@/components/games/GameImage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

const GamesPage = async ({
  searchParams,
}: {
  readonly searchParams: Promise<{
    page?: string;
    q?: string;
    state?: string;
  }>;
}) => {
  await requireRole(["ADMIN"], "/studio/games");
  const { page: pageParam, q, state: stateParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const offset = page * PAGE_SIZE;
  const searchName = q?.trim() || undefined;
  const state = parseState(stateParam?.trim());

  const data = await getManageGames(page, PAGE_SIZE, searchName, state);
  const { content: games, page: pageInfo } = data;
  const totalPages = pageInfo.totalPages;
  const start = pageInfo.totalElements === 0 ? 0 : offset + 1;
  const end = Math.min(offset + PAGE_SIZE, pageInfo.totalElements);

  const tabs: { value: GameState | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    ...GAME_STATES.map((value) => ({ value, label: STATE_LABELS[value] })),
  ];

  const tabHref = (value?: GameState) => {
    const params = new URLSearchParams();
    if (searchName) params.set("q", searchName);
    if (value) params.set("state", value);
    const qs = params.toString();
    return qs ? `/admin/games?${qs}` : "/admin/games";
  };

  const pageHref = (i: number) => {
    const params = new URLSearchParams();
    if (searchName) params.set("q", searchName);
    if (state) params.set("state", state);
    params.set("page", String(i));
    return `/admin/games?${params.toString()}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.5px] text-muted-foreground">
            Products
          </p>
          <h1 className="text-xl font-bold tracking-[0.4px] text-foreground">
            Productos
          </h1>
          <p className="text-sm text-muted-foreground">
            {pageInfo.totalElements} game
            {pageInfo.totalElements !== 1 ? "s" : ""} in catalog
          </p>
        </div>
        <Link
          href="/admin/games/new"
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          + Nuevo producto
        </Link>
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
        className="inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-[3px]"
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

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-3 text-muted-foreground text-xs font-bold uppercase tracking-[0.5px] w-16 hidden md:table-cell">
                ID
              </TableHead>
              <TableHead className="px-3 text-muted-foreground text-xs font-bold uppercase tracking-[0.5px] w-12 hidden sm:table-cell">
                Cover
              </TableHead>
              <TableHead className="px-3 text-muted-foreground text-xs font-bold uppercase tracking-[0.5px]">
                Name
              </TableHead>
              <TableHead className="px-3 text-muted-foreground text-xs font-bold uppercase tracking-[0.5px] w-24 hidden sm:table-cell">
                State
              </TableHead>
              <TableHead className="px-3 text-muted-foreground text-xs font-bold uppercase tracking-[0.5px] w-24">
                Price
              </TableHead>
              <TableHead className="px-3 text-muted-foreground text-xs font-bold uppercase tracking-[0.5px] w-20 hidden sm:table-cell">
                Discount
              </TableHead>
              <TableHead className="px-3 text-muted-foreground text-xs font-bold uppercase tracking-[0.5px] w-36 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  {searchName
                    ? `No games found matching "${searchName}"`
                    : state
                      ? "No games found with this state"
                      : "No games found"}
                </TableCell>
              </TableRow>
            ) : (
              games.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="px-3 text-muted-foreground hidden md:table-cell">
                    #{g.id}
                  </TableCell>
                  <TableCell className="px-3 hidden sm:table-cell">
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
                  <TableCell className="px-3">
                    <Link
                      href={`/admin/games/${g.id}`}
                      className="text-foreground hover:underline truncate block"
                    >
                      {g.name}
                    </Link>
                  </TableCell>
                  <TableCell className="px-3 hidden sm:table-cell">
                    <Badge
                      className={
                        g.state === "AVAILABLE"
                          ? "bg-[#A1CD44]/15 text-[#A1CD44] border-transparent"
                          : g.state === "COMING_SOON"
                            ? "bg-[#FCAF17]/15 text-[#FCAF17] border-transparent"
                            : "bg-[#FF6B6B]/15 text-[#FF6B6B] border-transparent"
                      }
                    >
                      <TicketIcon />
                      {g.state}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3">${g.price.toFixed(2)}</TableCell>
                  <TableCell className="px-3 hidden sm:table-cell">
                    {g.discountPercent > 0 ? (
                      <span className="text-[#26BBFF] text-xs font-semibold whitespace-nowrap">
                        -{g.discountPercent}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs whitespace-nowrap">
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 text-right">
                    <div className="flex items-center justify-end">
                      <RowActions kind="game" id={g.id} label={g.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            Showing {start}-{end} of {pageInfo.totalElements}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={pageHref(i)}
                className={`size-8 flex items-center justify-center rounded-md text-sm ${
                  i === page
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default GamesPage;
