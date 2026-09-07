"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatPrice } from "@/lib";
import { addToCart, isInCart } from "@/lib/cart";
import { useAlert } from "@/components/ui";
import { GameVideo } from "@/components/games/GameVideo";
import type { Game } from "@/types";
import { CatalogList } from "@/components/games";
import { Pagination } from "@/components/ui";

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

function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: Readonly<{
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onNavigate((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, index, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close gallery"
        className="absolute top-4 right-4 text-white text-3xl leading-none px-2 py-1 hover:bg-white/10 rounded cursor-pointer z-10"
        onClick={onClose}
      >
        &times;
      </button>
      <button
        type="button"
        aria-label="Previous image"
        className="absolute left-2 md:left-4 text-white text-4xl px-3 py-2 hover:bg-white/10 rounded cursor-pointer z-10"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + images.length) % images.length);
        }}
      >
        &#8249;
      </button>
      <div className="relative w-[92vw] md:w-[80vw] h-[80vh]">
        <Image
          src={images[index]}
          alt="Gallery preview"
          fill
          className="object-contain"
          sizes="80vw"
        />
      </div>
      <button
        type="button"
        aria-label="Next image"
        className="absolute right-2 md:right-4 text-white text-4xl px-3 py-2 hover:bg-white/10 rounded cursor-pointer z-10"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % images.length);
        }}
      >
        &#8250;
      </button>
    </div>
  );
}

export const GameDetail = ({ game }: Props) => {
  const { showAlert } = useAlert();
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gallery = game.galleryUrls ?? [];

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
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* COLUMNA IZQUIERDA: Video + Descripción + Specs */}
        <div className="flex flex-col gap-2 flex-1">
          {game.videoUrl ? (
            <GameVideo
              src={game.videoUrl}
              poster={game.bannerUrl}
              title={game.name}
            />
          ) : (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={game.bannerUrl ?? game.imageUrl}
                alt={game.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {gallery.length > 0 && (
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent>
                {gallery.map((url, i) => (
                  <CarouselItem key={url} className="basis-1/2 md:basis-1/3">
                    <button
                      type="button"
                      className="relative w-full aspect-video rounded-3xl overflow-hidden bg-[#1A1A1A] cursor-pointer group"
                      onClick={() => setActiveIndex(i)}
                    >
                      <Image
                        src={url}
                        alt={`${game.name} screenshot ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-3 md:-left-4 bg-black/50 hover:bg-black/70 text-white border-none" />
              <CarouselNext className="-right-3 md:-right-4 bg-black/50 hover:bg-black/70 text-white border-none" />
            </Carousel>
          )}

          <p className="text-sm text-[#C0C0C0] leading-relaxed">
            {game.description}
          </p>

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

        {/* COLUMNA DERECHA: Categorías, Precios y Juego Destacado */}
        <div className="flex flex-col lg:w-96 shrink-0 gap-2">
          <div className="relative w-full aspect-video rounded-4xl overflow-hidden">
            <Image
              src={game.bannerUrl ?? game.imageUrl}
              alt={game.name}
              fill
              className="object-cover"
            />
          </div>

          {/* CATEGORÍAS */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 flex gap-2 flex-col">
            <h3 className="text-xl font-bold text-[#FAFAFA] ">{game.name}</h3>
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
            <p className="text-[#8A8A8A] font-medium text-sm">{`Launch date: ${game.launchDate}`}</p>

            {/* PRECIO, DESCUENTO Y BOTÓN EN FLEX ROW */}
            <div className="flex justify-between items-end gap-2">
              <div className="flex flex-col gap-2">
                {game.discountPercent > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="bg-[#A1CD44] text-black text-sm font-semibold px-2 py-1 rounded-md">
                      -{game.discountPercent}%
                    </span>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <span className="text-2xl font-bold text-[#FAFAFA]">
                    {formatPrice(game.price)}
                  </span>
                  <s className="text-sm text-[#8A8A8A] text-decoration-line-through">
                    {formatPrice(game.originalPrice)}
                  </s>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={alreadyInCart}
                className="bg-[#007AFF] hover:bg-[#1ea4ff] text-white font-semibold py-3 px-5 rounded-lg transition-colors cursor-pointer disabled:bg-[#3A3A3A] disabled:cursor-not-allowed disabled:hover:bg-[#3A3A3A]"
              >
                {alreadyInCart ? "Already in cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {activeIndex !== null && (
        <GalleryLightbox
          images={gallery}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
};
