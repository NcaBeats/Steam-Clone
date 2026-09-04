import {
  BannerCarousel,
  DiscountCarousel,
  CategoryChips,
  FreeToPlaySection,
  ComingSoonSection,
  CategoryCarouselsGrid,
} from "@/components/games";
import {
  getBannerGames,
  getDiscountedGames,
  getGames,
  getCategories,
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
  const [bannerGames, discountedGames, allGames, categories] =
    await Promise.all([
      getBannerGames(),
      getDiscountedGames(),
      getGames(),
      getCategories(),
    ]);

  return (
    <div className="flex flex-col p-2 gap-8 w-full max-w-7xl mx-auto min-h-screen">
      <BannerCarousel games={bannerGames} />
      <CategoryChips categories={categories} />
      <div className="flex flex-col">
        <h2 className="text-xl text-[#EDEDED] ml-1">Discounts and Offers</h2>
        <DiscountCarousel games={discountedGames} />
      </div>
      <FreeToPlaySection games={allGames} />
      <ComingSoonSection games={allGames} />
      <CategoryCarouselsGrid
        games={allGames}
        categoriesToShow={FEATURED_CATEGORIES}
      />
    </div>
  );
}
