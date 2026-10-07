import { Game } from "@/types";
import Link from "next/link";
import { formatPrice } from "@/lib";
import { GameImage } from "@/components/games/GameImage";

type Props = Readonly<
  Pick<
    Game,
    "id" | "name" | "price" | "originalPrice" | "discountPercent" | "imageUrl"
  >
>;

export const GameCard = ({
  id,
  name,
  price,
  originalPrice,
  discountPercent,
  imageUrl,
}: Props) => {
  const hasDiscount = discountPercent > 0;

  return (
    <Link
      href={`/games/${id}`}
      className="select-none cursor-pointer shadow-md shadow-[#00000089] group
        transition-all bg-[#161617] flex flex-col relative shrink-0
        active:bg-[#EDEDED] hover:bg-[#EDEDED]
        active:text-black hover:text-black duration-300 ease-in rounded-lg overflow-hidden w-full"
    >
      <div className="relative aspect-3/4 overflow-hidden">
        <GameImage
          src={imageUrl}
          alt="Game cover"
          fill
          sizes="(min-width: 640px) 18vw, 50vw"
          className="snap-start object-cover object-center block
            transition-transform duration-300 ease-out
            group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col p-2 gap-1 h-16">
        <h3 className="text-sm font-medium whitespace-nowrap text-ellipsis overflow-hidden">
          {name}
        </h3>

        <div className="items-center flex justify-between text-sm font-semibold">
          {hasDiscount ? (
            <span
              className="transition-colors ease-in group-hover:bg-[#007AFF]
              group-active:bg-[#007AFF] group-hover:text-white group-active:text-white
              font-semibold bg-[#A1CD44] text-black px-2 py-0.5 rounded-md"
            >
              -{discountPercent}%
            </span>
          ) : (
            <span />
          )}

          <span className="flex gap-1 rounded-lg ml-auto">
            {hasDiscount && (
              <s className="text-[#8A8A8A] font-normal">
                {formatPrice(originalPrice)}
              </s>
            )}
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </Link>
  );
};
