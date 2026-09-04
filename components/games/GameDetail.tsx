"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib";
import { addToCart, isInCart } from "@/lib/cart";
import { useAlert } from "@/components/ui";
import type { Game } from "@/types";

type Props = Readonly<{ game: Game }>;

const SPEC_LABELS: Record<string, string> = {
  os: "OS",
  processor: "Processor",
  memory: "Memory",
  graphics: "Graphics",
  storage: "Storage",
  directX: "DirectX",
  additional: "Additional",
  sound: "Sound",
  rayTracing: "Ray Tracing",
};

function parseSpecs(specsString: string | null): Record<string, string> | null {
  if (!specsString) return null;
  try {
    const parsed: unknown = JSON.parse(specsString);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, string>;
    }
    return null;
  } catch {
    return null;
  }
}

function formatKey(key: string): string {
  const lower = key.toLowerCase();
  if (SPEC_LABELS[lower]) return SPEC_LABELS[lower];
  return key.charAt(0).toUpperCase() + key.slice(1);
}

type SpecColumnProps = Readonly<{
  title: string;
  specs: Record<string, string>;
}>;

const SpecColumn = ({ title, specs }: SpecColumnProps) => (
  <div className="flex flex-col gap-2">
    <h3 className="text-xs uppercase font-bold text-[#FAFAFA] border-b border-[#2A2A2A] pb-2">
      {title}
    </h3>
    {Object.entries(specs).map(([key, value]) => (
      <div key={key} className="flex justify-between gap-4 text-xs">
        <span className="text-[#8A8A8A] shrink-0">{formatKey(key)}:</span>
        <span className="text-[#EDEDED] text-right">{value}</span>
      </div>
    ))}
  </div>
);

export const GameDetail = ({ game }: Props) => {
  const { showAlert } = useAlert();
  const [alreadyInCart, setAlreadyInCart] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setAlreadyInCart(isInCart(game.id));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [game.id]);

  const handleAddToCart = () => {
    const result = addToCart({
      id: game.id,
      name: game.name,
      price: game.price,
      imageUrl: game.imageUrl,
      discountPercent: game.discountPercent,
    });
    if (result.ok) {
      setAlreadyInCart(true);
      showAlert({
        variant: "default",
        title: "Added to cart",
        description: `${game.name} was added to your cart.`,
      });
      return;
    }
    if (result.reason === "duplicate") {
      showAlert({
        variant: "destructive",
        title: "Already in cart",
        description: result.error,
      });
      return;
    }
    showAlert({
      variant: "destructive",
      title: "Could not add to cart",
      description: result.error,
    });
  };

  const minSpecs = parseSpecs(game.minimumSpecs);
  const recSpecs = parseSpecs(game.recommendedSpecs);
  const hasSpecs = minSpecs !== null || recSpecs !== null;

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
            disabled={alreadyInCart}
            className="bg-[#007AFF] hover:bg-[#1ea4ff] text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:bg-[#3A3A3A] disabled:cursor-not-allowed disabled:hover:bg-[#3A3A3A]"
          >
            {alreadyInCart ? "Already in cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      {hasSpecs && (
        <div className="bg-[#1A1A1A] rounded-lg p-6 flex flex-col gap-4">
          <h2 className="text-base font-bold text-[#FAFAFA]">
            System Requirements
          </h2>
          <div
            className={`grid gap-6 ${
              minSpecs !== null && recSpecs !== null
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {minSpecs !== null && (
              <SpecColumn title="Minimum" specs={minSpecs} />
            )}
            {recSpecs !== null && (
              <SpecColumn title="Recommended" specs={recSpecs} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
