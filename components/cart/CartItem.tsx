import Link from "next/link";
import { X } from "lucide-react";
import { formatPrice } from "@/lib";
import { GameImage } from "@/components/games/GameImage";
import type { CartItem as CartItemType } from "@/stores/cart-store";

type Props = Readonly<{
  item: CartItemType;
  onRemove: (id: number) => void;
}>;

export const CartItem = ({ item, onRemove }: Props) => {
  return (
    <div className="flex items-center gap-4 hover:bg-[#161617]  rounded-lg p-3">
      <Link
        href={`/games/${item.id}`}
        className="relative w-16 h-20 shrink-0 rounded overflow-hidden"
      >
        <GameImage
          src={item.imageUrl}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </Link>
      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <Link
          href={`/games/${item.id}`}
          className="text-sm font-medium text-[#FAFAFA] truncate hover:underline w-fit max-w-full"
        >
          {item.name}
        </Link>
        <div className="flex items-center gap-2">
          {item.discountPercent > 0 && (
            <span className="bg-[#FCAF17] text-black text-xs font-bold px-1.5 py-0.5 rounded">
              -{item.discountPercent}%
            </span>
          )}
          <span className="text-sm font-bold text-[#FAFAFA]">
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="text-[#8A8A8A] hover:text-red-500 transition-colors p-1 cursor-pointer"
      >
        <X size={18} />
      </button>
    </div>
  );
};
