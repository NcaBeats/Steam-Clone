import type { Game } from "@/types";
import { formatPrice } from "@/lib";
import { GameImage } from "@/components/games/GameImage";

type Props = Readonly<
  Pick<
    Game,
    "name" | "price" | "originalPrice" | "discountPercent" | "imageUrl"
  >
>;

/**
 * Fila presentacional para resultados del buscador.
 * Sin <Link>: la navegación la resuelve el Combobox vía onValueChange,
 * así no se anidan interactivos dentro del [role="option"].
 */
export const SearchGameRow = ({
  name,
  price,
  originalPrice,
  discountPercent,
  imageUrl,
}: Props) => {
  const hasDiscount = discountPercent > 0;

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded">
        <GameImage
          src={imageUrl}
          alt={name}
          fill
          sizes="64px"
          className="object-cover object-center"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="flex min-w-0 items-center gap-1.5 text-xs font-semibold">
          {hasDiscount && (
            <span className="shrink-0 rounded bg-[#A1CD44] px-1.5 py-0.5 text-[10px] leading-none text-black">
              -{discountPercent}%
            </span>
          )}
          {hasDiscount && (
            <s className="truncate text-[10px] font-normal text-[#8A8A8A]">
              {formatPrice(originalPrice)}
            </s>
          )}
          <span className="truncate">{formatPrice(price)}</span>
        </p>
      </div>
    </div>
  );
};
