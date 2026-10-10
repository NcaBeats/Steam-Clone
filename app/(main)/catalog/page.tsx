import { CatalogList } from "@/components/games";
import { Pagination } from "@/components/navigation";
import { PriceFilter } from "@/components/catalog/PriceFilter";
import { getGamesPaginated, searchGamesPaginated } from "@/lib/api/games";
import Link from "next/link";

const PAGE_SIZE = 10;

type Props = Readonly<{
  searchParams: Promise<{ page?: string; q?: string }>;
}>;

const CatalogPage = async ({ searchParams }: Props) => {
  const { page: pageParam, q: qParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const query = qParam?.trim() ?? "";

  const [data] = await Promise.all([
    query
      ? searchGamesPaginated(query, page, PAGE_SIZE)
      : getGamesPaginated(page, PAGE_SIZE),
  ]);

  const { content: games, page: pageInfo } = data;

  return (
    <div className="flex flex-col p-2 gap-4 w-full max-w-6xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold text-[#FAFAFA] ml-1 mt-8">
        {query ? `Results for "${query}"` : "Catalog"}
      </h1>
      {query && (
        <p className="text-sm text-[#8A8A8A] ml-1">
          {pageInfo.totalElements} result
          {pageInfo.totalElements !== 1 ? "s" : ""}
        </p>
      )}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex flex-col gap-2 flex-1 min-w-0 ">
          {query && games.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-[#8A8A8A] text-lg">
                No games found for &quot;{query}&quot;
              </p>
              <Link
                href="/catalog"
                className="text-[#007AFF] hover:underline text-sm font-medium"
              >
                Browse the catalog
              </Link>
            </div>
          ) : (
            <>
              <CatalogList games={games} />
              <div className="flex justify-center">
                <Pagination
                  page={page}
                  totalPages={pageInfo.totalPages}
                  basePath="/catalog"
                  query={query ? { q: query } : undefined}
                />
              </div>
            </>
          )}
        </div>
        <aside className="hidden xl:flex flex-col w-80 shrink-0 self-start sticky top-20 gap-3">
          <PriceFilter />
        </aside>
      </div>
    </div>
  );
};

export default CatalogPage;
