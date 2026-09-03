import Image from "next/image";
import { X } from "lucide-react";
import { formatPrice } from "@/lib";
import type { CartItem as CartItemType } from "@/lib/cart";

type Props = Readonly<{
  item: CartItemType;
  onRemove: (id: number) => void;
}>;

export const CartItem = ({ item, onRemove }: Props) => {
  return (
    <div className="flex items-center gap-4 bg-[#1A1A1A] rounded-lg p-3">
      <div className="relative w-16 h-20 shrink-0 rounded overflow-hidden">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <h3 className="text-sm font-medium text-[#FAFAFA] truncate">
          {item.name}
        </h3>
        <div className="flex items-center gap-2">
          {item.discountPercent > 0 && (
            <span className="bg-[#A1CD44] text-black text-xs font-bold px-1.5 py-0.5 rounded">
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
