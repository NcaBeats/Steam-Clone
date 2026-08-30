import { Carousel, CarouselItems } from "@/components/ui";

export default function Home() {
  return (
    <div className="flex flex-col p-2 gap-2 min-h-screen w-full bg-[#18181C] bg-[radial-gradient(circle_at_50%_30%,#1e5ac84d_0%,transparent_60%)]">
      <Carousel />
      <CarouselItems />
    </div>
  );
}
