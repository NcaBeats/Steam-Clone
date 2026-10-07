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

export const GameCardBig = ({
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
        bg-[#161617] flex flex-col relative shrink-0 rounded-lg overflow-hidden w-full"
    >
      <div className="relative aspect-3/4 w-full">
        <GameImage
          src={imageUrl}
          alt="Game cover"
          fill
          sizes="(min-width: 640px) 18vw, 50vw"
          className="snap-start object-cover object-center block
            transform transition-transform duration-300 ease-in-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25 pointer-events-none z-0" />

        <div
          className="absolute bottom-0 left-0 w-full flex flex-col p-2 gap-1 h-auto
          bg-[#161617]/75 text-white z-10 backdrop-blur-sm
          transform translate-y-0 transition-transform duration-300 ease-in-out
          group-hover:translate-y-full
          md:h-24 md:p-3 md:gap-2 md:justify-between"
        >
          <h3 className="text-sm md:text-lg font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
            {name}
          </h3>

          <div className="items-center flex justify-between text-sm font-semibold w-full">
            {hasDiscount ? (
              <span
                className="transition-colors duration-300 ease-in-out
                group-hover:bg-[#007AFF] group-active:bg-[#007AFF]
                group-hover:text-white group-active:text-white
                font-bold bg-[#A1CD44] text-black px-2 py-0.5 rounded-md mb-0.5 text-sm md:text-lg"
              >
                -{discountPercent}%
              </span>
            ) : (
              <span />
            )}

            <span className="flex text-sm md:text-xl gap-2 rounded-lg ml-auto items-baseline leading-none">
              {hasDiscount && (
                <s className="text-[#8A8A8A] text-sm md:text-lg font-normal leading-none">
                  {formatPrice(originalPrice)}
                </s>
              )}
              {formatPrice(price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
