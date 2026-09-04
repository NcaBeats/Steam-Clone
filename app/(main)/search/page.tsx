import Link from "next/link";
import { CatalogList } from "@/components/games";
import { searchGames } from "@/lib/api/games";

type Props = {
  readonly searchParams: Promise<{ q?: string }>;
};

const SearchPage = async ({ searchParams }: Props) => {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchGames(query) : [];

  return (
    <div className="flex flex-col p-2 gap-4 w-full max-w-7xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-[#FAFAFA] ml-1">
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      {query ? (
        <p className="text-sm text-[#8A8A8A] ml-1">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </p>
      ) : (
        <p className="text-sm text-[#8A8A8A] ml-1">
          Use the search bar to find games by name.
        </p>
      )}
      {query && results.length === 0 ? (
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
        <div className="max-w-3xl w-full">
          <CatalogList games={results} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
