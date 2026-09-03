import { BannerCarousel, DiscountCarousel, GameList } from "@/components/games";
import { getBannerGames, getDiscountedGames } from "@/lib/api/games";

export default async function Home() {
  const [bannerGames, discountedGames] = await Promise.all([
    getBannerGames(),
    getDiscountedGames(),
  ]);

  return (
    <div
      className="flex flex-col p-2 gap-8 min-h-screen w-full
     bg-[#18181C] bg-[radial-gradient(circle_at_50%_30%,#1e5ac84d_0%,transparent_60%)]
     "
    >
      <BannerCarousel games={bannerGames} />
      <div className="flex flex-col">
        <h2 className="text-xl text-[#EDEDED] ml-1">Discounts and Offers</h2>
        <DiscountCarousel games={discountedGames} />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">The Most Played</h2>
        <GameList />
      </div>
    </div>
  );
}
