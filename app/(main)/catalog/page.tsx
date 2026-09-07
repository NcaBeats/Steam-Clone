import { CatalogList } from "@/components/games";
import { Pagination } from "@/components/ui";
import { getGamesPaginated, getBannerGames } from "@/lib/api/games";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib";

const PAGE_SIZE = 10;

type Props = Readonly<{
  searchParams: Promise<{ page?: string }>;
}>;

const CatalogPage = async ({ searchParams }: Props) => {
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));

  const [data, bannerGames] = await Promise.all([
    getGamesPaginated(page, PAGE_SIZE),
    getBannerGames(),
  ]);

  const { content: games, page: pageInfo } = data;
  const totalElements = pageInfo.totalElements;
  const featured = bannerGames[0] ?? games[0];

  return (
    <div className="flex flex-col p-2 gap-4 w-full max-w-6xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-[#FAFAFA] ml-1">Catalog</h1>
      <p className="text-sm text-[#8A8A8A] ml-1">
        {totalElements} game{totalElements !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <CatalogList games={games} />
          <Pagination
            page={page}
            totalPages={pageInfo.totalPages}
            basePath="/catalog"
          />
        </div>
        {featured && (
          <aside className="hidden xl:flex flex-col w-80 shrink-0 self-start sticky top-20 gap-3">
            <Link
              href={`/games/${featured.id}`}
              className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col gap-3 hover:bg-[#272727] transition-colors"
            >
              <h2 className="text-lg font-bold text-[#FAFAFA]">
                {featured.name}
              </h2>
              <p className="text-xs text-[#8A8A8A]">
                {featured.categories.map((c) => c.name).join(", ")}
              </p>
              <div className="relative w-full aspect-video rounded overflow-hidden">
                <Image
                  src={featured.bannerUrl ?? featured.imageUrl}
                  alt={featured.name}
                  fill
                  className="object-cover"
                />
              </div>
              {featured.description && (
                <p className="text-xs text-[#C0C0C0] line-clamp-4">
                  {featured.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-1">
                {featured.discountPercent > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="bg-[#A1CD44] text-black text-xs font-bold px-2 py-1 rounded">
                      -{featured.discountPercent}%
                    </span>
                    <s className="text-xs text-[#8A8A8A]">
                      {formatPrice(featured.originalPrice)}
                    </s>
                  </div>
                ) : (
                  <span />
                )}
                <span className="text-base font-bold text-[#FAFAFA]">
                  {formatPrice(featured.price)}
                </span>
              </div>
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
