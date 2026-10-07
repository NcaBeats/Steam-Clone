import {
  BannerCarousel,
  DiscountCarouselFeatured,
  CategoryChips,
  FreeToPlaySection,
  ComingSoonSection,
  CategoryCarouselsGrid,
} from "@/components/games";
import {
  getBannerGames,
  getDiscountedGames,
  getFreeToPlayGames,
  getComingSoonGames,
  getCategories,
  getGames,
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
    bannerGames,
    discountedGames,
    freeToPlayGames,
    comingSoonGames,
    categories,
    allGames,
  ] = await Promise.all([
    getBannerGames(),
    getDiscountedGames(),
    getFreeToPlayGames(),
    getComingSoonGames(),
    getCategories(),
    getGames(),
  ]);

  return (
    <div className="flex flex-col p-2 gap-8 w-full max-w-6xl mx-auto min-h-screen">
      <BannerCarousel games={bannerGames} />
      <section className="flex flex-col">
        <h2 className="text-3xl text-[#EDEDED] ml-1">Discounts and Offers</h2>
        <DiscountCarouselFeatured games={discountedGames} />
      </section>
      <CategoryChips categories={categories} />
      <FreeToPlaySection games={freeToPlayGames} />
      <ComingSoonSection games={comingSoonGames} />
      <CategoryCarouselsGrid
        games={allGames}
        categoriesToShow={FEATURED_CATEGORIES}
      />
    </div>
  );
}
