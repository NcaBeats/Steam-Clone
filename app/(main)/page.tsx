import {
  BannerCarousel,
  DiscountCarouselFeatured,
  CategoryChips,
  FreeToPlaySection,
  ComingSoonSection,
  CategoryCarouselsGrid,
} from "@/components/games";
import {
  getDiscountedGames,
  getFreeToPlayGames,
  getComingSoonGames,
  getCategories,
  getGames,
  getRecentGames,
} from "@/lib/api/games";

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
        <BannerCarousel games={recentGames} />
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
