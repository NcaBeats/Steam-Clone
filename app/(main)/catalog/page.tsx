import { CatalogList } from "@/components/games";
import { Pagination } from "@/components/navigation";
import {
  PriceFilter,
  PRICE_MIN,
  PRICE_MAX,
} from "@/components/catalog/PriceFilter";
import { getGamesFiltered } from "@/lib/api/games";
import Link from "next/link";

const PAGE_SIZE = 10;

type Props = Readonly<{
  searchParams: Promise<{
    page?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}>;

const parsePrice = (raw: string | undefined): number | undefined => {
  if (raw === undefined || raw.trim() === "") return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return undefined;
  return value;
};

const CatalogPage = async ({ searchParams }: Props) => {
  const {
    page: pageParam,
    q: qParam,
    minPrice: minParam,
    maxPrice: maxParam,
  } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const query = qParam?.trim() ?? "";

  let minPrice = parsePrice(minParam);
  let maxPrice = parsePrice(maxParam);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  const priceFiltered = minPrice !== undefined || maxPrice !== undefined;

  const data = await getGamesFiltered({
    name: query || undefined,
    minPrice,
    maxPrice,
    page,
    size: PAGE_SIZE,
  });

  const { content: games, page: pageInfo } = data;

  const pageQuery: Record<string, string> = {};
  if (query) pageQuery.q = query;
  if (minPrice !== undefined) pageQuery.minPrice = String(minPrice);
  if (maxPrice !== undefined) pageQuery.maxPrice = String(maxPrice);

  const clearParams = new URLSearchParams();
  if (query) clearParams.set("q", query);

  return (
    <div className="flex flex-col p-2 gap-4 w-full max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold text-[#FAFAFA] ml-1 mt-8">
        {query ? `Results for "${query}"` : "Catalog"}
      </h1>
      {(query || priceFiltered) && (
        <p className="text-sm text-[#8A8A8A] ml-1">
          {pageInfo.totalElements} result
          {pageInfo.totalElements !== 1 ? "s" : ""}
        </p>
      )}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex flex-col gap-2 flex-1 min-w-0 ">
          {games.length === 0 && (query || priceFiltered) ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              {priceFiltered ? (
                <>
                  <p className="text-[#8A8A8A] text-lg">
                    No games in this price range
                  </p>
                  <Link
                    href={
                      clearParams.toString()
                        ? `/catalog?${clearParams.toString()}`
                        : "/catalog"
                    }
                    className="text-[#8A8A8A] hover:underline text-sm font-medium"
                  >
                    Clear price filter
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-[#8A8A8A] text-lg">
                    No games found for &quot;{query}&quot;
                  </p>
                  <Link
                    href="/catalog"
                    className="text-[#8A8A8A] hover:underline text-sm font-medium"
                  >
                    Browse the catalog
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <CatalogList games={games} />
              <div className="flex justify-center">
                <Pagination
                  page={page}
                  totalPages={pageInfo.totalPages}
                  basePath="/catalog"
                  query={
                    Object.keys(pageQuery).length > 0 ? pageQuery : undefined
                  }
                />
              </div>
            </>
          )}
        </div>
        <aside className="hidden xl:flex flex-col w-80 shrink-0 self-start sticky top-20 gap-3">
          <PriceFilter
            key={`${minPrice ?? "all"}-${maxPrice ?? "all"}`}
            min={minPrice ?? PRICE_MIN}
            max={maxPrice ?? PRICE_MAX}
          />
        </aside>
      </div>
    </div>
  );
};

export default CatalogPage;
