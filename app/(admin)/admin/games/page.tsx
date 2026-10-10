import Link from "next/link";
import { requireRole } from "@/actions/admin/guard";
import { getManageGames } from "@/lib/api/games";
import { SearchInput } from "@/components/admin/SearchInput";
import { DeleteGameButton } from "@/components/admin/DeleteGameButton";
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
        <SearchInput placeholder="Search by name..." paramName="q" />
        {(searchName || state) && (
          <Link
            href="/admin/games"
            className="text-sm text-[#8A8A8A] hover:text-white whitespace-nowrap"
          >
            Limpiar filtro
          </Link>
        )}
      </div>

      <nav
        aria-label="Filter by state"
        className="inline-flex w-fit items-center gap-1 rounded-lg bg-[#202024] p-[3px]"
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
                  ? "bg-[#28282C] text-white shadow-sm"
                  : "text-[#8A8A8A] hover:text-white",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="bg-[#202024] border border-white/[0.06] rounded-lg overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-[#18181C] hover:bg-[#18181C]">
              <TableHead className="px-3 text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px] w-16 hidden md:table-cell">
                ID
              </TableHead>
              <TableHead className="px-3 text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px] w-12 hidden sm:table-cell">
                Cover
              </TableHead>
              <TableHead className="px-3 text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px]">
                Name
              </TableHead>
              <TableHead className="px-3 text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px] w-24 hidden sm:table-cell">
                State
              </TableHead>
              <TableHead className="px-3 text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px] w-24">
                Price
              </TableHead>
              <TableHead className="px-3 text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px] w-20 hidden sm:table-cell">
                Discount
              </TableHead>
              <TableHead className="px-3 text-[#8A8A8A] text-xs font-bold uppercase tracking-[0.5px] w-36 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="px-3 py-8 text-center text-[#8A8A8A]"
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
                <TableRow
                  key={g.id}
                  className="border-white/[0.06] hover:bg-[#28282C] transition-colors"
                >
                  <TableCell className="px-3 text-[#8A8A8A] hidden md:table-cell">
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
                      className="text-[#007AFF] hover:underline truncate block"
                    >
                      {g.name}
                    </Link>
                  </TableCell>
                  <TableCell className="px-3 hidden sm:table-cell">
                    <Badge
                      className={
                        g.state === "AVAILABLE"
                          ? "bg-[#28282C] text-[#FAFAFA] border-transparent"
                          : "bg-[#101014] text-[#8A8A8A] border-transparent"
                      }
                    >
                      {g.state}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 text-[#FAFAFA]">
                    ${g.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-3 hidden sm:table-cell">
                    {g.discountPercent > 0 ? (
                      <span className="text-[#26BBFF] text-xs font-semibold whitespace-nowrap">
                        -{g.discountPercent}%
                      </span>
                    ) : (
                      <span className="text-[#5A5A5A] text-xs whitespace-nowrap">
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/games/${g.id}`}
                        className="text-[#007AFF] hover:text-[#1ea4ff] text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteGameButton id={g.id} name={g.name} />
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
          <span className="text-[#8A8A8A]">
            Showing {start}-{end} of {pageInfo.totalElements}
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <Link
                key={i}
                href={pageHref(i)}
                className={`size-8 flex items-center justify-center rounded-md text-sm ${
                  i === page
                    ? "bg-[#28282C] text-white"
                    : "text-[#8A8A8A] hover:bg-[#28282C] hover:text-white"
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
