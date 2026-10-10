import type { Game } from "@/types";
import { formatPrice } from "@/lib";
import { GameImage } from "@/components/games/GameImage";

type Props = Readonly<
  Pick<
    Game,
    "name" | "price" | "originalPrice" | "discountPercent" | "imageUrl"
  >
>;

export const SearchGameRow = ({
  name,
  price,
  originalPrice,
  discountPercent,
  imageUrl,
}: Props) => {
  const hasDiscount = discountPercent > 0;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded">
        <GameImage
          src={imageUrl}
          alt={name}
          fill
          sizes="64px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex min-w-0 flex-1 text-base flex-col gap-0.5">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold">
          {hasDiscount && (
            <span className="shrink-0 rounded bg-[#A1CD44] p-1 leading-none text-black">
              -{discountPercent}%
            </span>
          )}
          {hasDiscount && (
            <s className="truncate font-normal text-[#8A8A8A]">
              {formatPrice(originalPrice)}
            </s>
          )}
          <span className="truncate">{formatPrice(price)}</span>
        </p>
      </div>
    </div>
  );
};
