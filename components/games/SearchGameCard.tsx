import { Game } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib";

type Props = Readonly<
  Pick<
    Game,
    "id" | "name" | "price" | "originalPrice" | "discountPercent" | "imageUrl"
  >
>;

export const SearchGameCard = ({
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
        transition-all hover:scale-[1.03] active:scale-[1.03]
      bg-[#161617] flex flex-col relative shrink-0
      active:bg-[#EDEDED] hover:bg-[#EDEDED]
      active:text-black hover:text-black duration-200 ease-in rounded-lg overflow-hidden w-full"
    >
      <div className="relative aspect-3/4">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover object-center block transition-all duration-300 ease-out"
        />
      </div>

      <div className="flex flex-col p-1.5 gap-0.5 h-12">
        <h3 className="text-xs font-medium whitespace-nowrap text-ellipsis overflow-hidden">
          {name}
        </h3>

        <div className="items-center flex justify-between gap-1 text-xs font-semibold">
          {hasDiscount ? (
            <span
              className="transition-colors ease-in group-hover:bg-[#007AFF]
           group-active:bg-[#007AFF] group-hover:text-white group-active:text-white
            font-semibold bg-[#A1CD44] text-black px-1.5 py-0.5 rounded text-[10px] leading-none shrink-0"
            >
              -{discountPercent}%
            </span>
          ) : (
            <span />
          )}
          <span className="flex gap-1 items-baseline ml-auto min-w-0">
            {hasDiscount && (
              <s className="text-[#8A8A8A] text-[10px] truncate">
                {formatPrice(originalPrice)}
              </s>
            )}
            <span className="truncate">{formatPrice(price)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
};
