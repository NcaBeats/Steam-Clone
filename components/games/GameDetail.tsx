"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib";
import { addToCart } from "@/lib/cart";
import type { Game } from "@/types";

type Props = Readonly<{ game: Game }>;

export const GameDetail = ({ game }: Props) => {
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart({
      id: game.id,
      name: game.name,
      price: game.price,
      imageUrl: game.imageUrl,
      discountPercent: game.discountPercent,
    });
    router.push("/cart");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
        <Image
          src={game.bannerUrl ?? game.imageUrl}
          alt={game.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-48 h-64 shrink-0 rounded-lg overflow-hidden self-start">
          <Image
            src={game.imageUrl}
            alt={game.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-[#FAFAFA]">{game.name}</h1>
            <span className="text-xs text-[#8A8A8A] bg-[#2A2A2A] self-start px-2 py-1 rounded">
              {game.state}
            </span>
            <div className="flex flex-wrap gap-2">
              {game.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="text-xs bg-[#2A2A2A] text-[#EDEDED] px-2 py-1 rounded"
                >
                  {cat.name}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#8A8A8A]">Release: {game.launchDate}</p>
          </div>

          <p className="text-sm text-[#C0C0C0] leading-relaxed">
            {game.description}
          </p>
        </div>

        <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col gap-3 w-full md:w-64 shrink-0 self-start">
          {game.discountPercent > 0 && (
            <div className="flex items-center gap-2">
              <span className="bg-[#A1CD44] text-black text-sm font-bold px-2 py-1 rounded">
                -{game.discountPercent}%
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1">
            {game.discountPercent > 0 && (
              <s className="text-sm text-[#8A8A8A]">
                {formatPrice(game.originalPrice)}
              </s>
            )}
            <span className="text-2xl font-bold text-[#FAFAFA]">
              {formatPrice(game.price)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-[#007AFF] hover:bg-[#1ea4ff] text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
