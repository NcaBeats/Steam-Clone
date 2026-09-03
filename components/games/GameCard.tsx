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

export const GameCard = ({
  id,
  name,
  price,
  originalPrice,
  discountPercent,
  imageUrl,
}: Props) => {
  return (
    <Link
      href={`/games/${id}`}
      className="select-none cursor-pointer shadow-md shadow-[#00000089] group
        transition-all hover:scale-104 active:scale-104
      bg-[#161617] flex flex-col relative shrink-0
      active:bg-[#EDEDED] hover:bg-[#EDEDED]
      active:text-black hover:text-black duration-200 ease-in rounded-lg overflow-hidden w-full"
    >
      <div className="relative aspect-3/4 ">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="snap-start
          object-cover object-center block transition-all duration-300 ease-out
           "
        />
      </div>

      <div
        className="flex flex-col p-2 gap-1  h-16
      "
      >
        <h3 className="text-sm font-medium whitespace-nowrap text-ellipsis overflow-hidden">
          {name}
        </h3>

        <div className="items-center flex justify-between text-sm font-semibold">
          <span
            className="transition-colors ease-in group-hover:bg-[#007AFF]
           group-active:bg-[#007AFF] group-hover:text-white group-active:text-white
            font-semibold bg-[#A1CD44] text-black px-2 py-0.5 rounded-md"
          >
            {discountPercent}%
          </span>
          <span className="flex gap-1 rounded-lg ">
            <s className="text-[#8A8A8A]">{formatPrice(originalPrice)}</s>
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </Link>
  );
};
