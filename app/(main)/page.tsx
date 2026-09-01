import { Carousel, CarouselItems, GameList } from "@/components/ui";
import { getBannerGames } from "@/lib/api";

export default async function Home() {
  const bannerGames = await getBannerGames();

  return (
    <div
      className="flex flex-col p-2 gap-8 min-h-screen w-full
     bg-[#18181C] bg-[radial-gradient(circle_at_50%_30%,#1e5ac84d_0%,transparent_60%)]
     "
    >
      <Carousel games={bannerGames} />
      <div className="flex flex-col">
        <h2 className="text-xl text-[#EDEDED] ml-1">Discounts and Offers</h2>
        <CarouselItems />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl">The Most Played</h2>
        <GameList />
      </div>
    </div>
  );
}
