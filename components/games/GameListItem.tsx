import Link from "next/link";
import { Gamepad2, Trophy, BadgeCheck } from "lucide-react";
import { Category } from "@/types";
import { formatPrice } from "@/lib";
import { GameImage } from "@/components/games/GameImage";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Props = Readonly<{
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  bannerUrl: string | null;
  categories: Category[];
  launchDate: string;
}>;

export const GameListItem = ({
  id,
  name,
  price,
  categories,
  launchDate,
  imageUrl,
  bannerUrl,
}: Props) => {
  return (
    <Link
      href={`/games/${id}`}
      className="overflow-hidden rounded-lg select-none shadow-sm shadow-[#00000089] cursor-pointer group flex relative transition-transform hover:scale-101 active:scale-101"
    >
      <AspectRatio
        ratio={16 / 9}
        className="w-40 sm:w-48 shrink-0 overflow-hidden"
      >
        <GameImage
          src={bannerUrl ?? imageUrl}
          alt={name}
          fill
          sizes="(min-width: 640px) 192px, 160px"
          className="object-cover object-center transition-transform duration-200 group-hover:scale-105"
        />
      </AspectRatio>
      <div
        className="flex flex-col p-4 hover:bg-[#161617] gap-1 w-full justify-center
           duration-200 ease-in
          "
      >
        <h3 className="text-md font-medium">{name}</h3>
        <h4 className="text-xs">
          {categories.map((cat) => cat.name).join(", ")}
        </h4>
        <div className="flex items-center justify-between gap-2">
          <ul className="flex gap-1 [&_li]:text-[#007AFF]">
            <li>
              <Gamepad2 size={20} />
            </li>
            <li>
              <Trophy size={20} />
            </li>
            <li>
              <BadgeCheck size={20} />
            </li>
          </ul>
          <p className="text-xs text-[#8A8A8A] mx-auto">
            Launch Date: {launchDate}
          </p>
          <span className="text-sm font-semibold text-white whitespace-nowrap">
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </Link>
  );
};
