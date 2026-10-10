import {
  DiscountCarouselFeatured,
  CategoryChips,
  FreeToPlaySection,
  ComingSoonSection,
  CategoryCarouselsGrid,
} from "@/components/games";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import {
  getDiscountedGames,
  getFreeToPlayGames,
  getComingSoonGames,
  getCategories,
  getGames,
  getRecentGames,
} from "@/lib/api/games";
import Link from "next/link";

const FEATURED_CATEGORIES = [
  "Action",
  "RPG",
  "Adventure",
  "Shooter",
  "Strategy",
  "Indie",
  "Sports",
  "Racing",
  "Fighting",
  "Horror",
  "Simulation",
  "Open World",
];

export default async function Home() {
  const [
    recentGames,
    discountedGames,
    freeToPlayGames,
    comingSoonGames,
    categories,
    allGames,
  ] = await Promise.all([
    getRecentGames(8),
    getDiscountedGames(),
    getFreeToPlayGames(),
    getComingSoonGames(),
    getCategories(),
    getGames(),
  ]);

  return (
    <div className="flex flex-col gap-8 w-full min-h-screen">
      <section className="w-full">
        <AspectRatio ratio={16 / 9} className="relative">
          <Image
            src="/MainBanner/Jason_and_Lucia_02_landscape.webp"
            alt="Jason and Lucia"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col items-start justify-end px-2 pb-6 sm:pb-10 xl:pb-14">
              <h1 className="text-base font-bold leading-tight text-white sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl">
                Your next adventure begins here.
              </h1>

              <p className="mt-1 max-w-[90%] text-xs leading-relaxed text-white/80 sm:mt-2 sm:text-sm md:max-w-lg md:text-base lg:text-lg">
                Explore, discover, and find your next favorite game.
              </p>

              <Link
                href="/catalog"
                className="mt-2 ease-out duration-200 rounded-full bg-[#fcaf17] px-3 py-1.5 text-xs font-semibold text-black transition-colors hover:bg-[#fcc456] sm:mt-3 sm:px-4 sm:py-2 sm:text-sm md:mt-5 md:px-6 md:py-3 md:text-base"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </AspectRatio>
      </section>
      <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto p-2">
        <section className="flex flex-col">
          <DiscountCarouselFeatured
            games={discountedGames}
            title="Discounts and Offers"
            titleClassName="text-3xl text-[#EDEDED] ml-1"
          />
        </section>
        <CategoryChips categories={categories} />
        <FreeToPlaySection games={freeToPlayGames} />
        <ComingSoonSection games={comingSoonGames} />
        <CategoryCarouselsGrid
          games={allGames}
          categoriesToShow={FEATURED_CATEGORIES}
        />
      </div>
    </div>
  );
}
