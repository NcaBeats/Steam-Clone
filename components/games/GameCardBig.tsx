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
      {/* Contenedor relativo de la tarjeta (Mantiene la proporción 3/4) */}
      <div className="relative aspect-3/4 w-full">
        {/* IMAGEN: Ahora con transición y escala suave en hover */}
        <GameImage
          src={imageUrl}
          alt="Game cover"
          fill
          sizes="(min-width: 640px) 18vw, 50vw"
          className="snap-start object-cover object-center block
            transform transition-transform duration-300 ease-in-out group-hover:scale-105"
        />

        {/* VELO NEGRO: Capa transparente que oscurece la imagen en hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25 pointer-events-none z-0" />

        {/* DIV DE TEXTO FIJO OVERLAY: Se aumentó la altura a h-24 para que entren los textos grandes */}
        <div
          className="absolute bottom-0 left-0 w-full flex flex-col p-3 gap-2 h-24
          bg-[#161617]/75 text-white z-10 justify-between backdrop-blur-sm
          transform translate-y-0 transition-transform duration-300 ease-in-out
          group-hover:translate-y-full"
        >
          {/* Título */}
          <h3 className="text-xl font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
            {name}
          </h3>

          {/* Fila inferior: Alineación vertical corregida con items-end para textos grandes */}
          <div className="items-end flex justify-between text-sm font-semibold w-full">
            {hasDiscount ? (
              <span
                className="transition-colors duration-300 ease-in-out
                group-hover:bg-[#007AFF] group-active:bg-[#007AFF]
                group-hover:text-white group-active:text-white
                font-bold bg-[#A1CD44] text-black px-2 py-0.5 rounded-md mb-0.5 text-xl"
              >
                -{discountPercent}%
              </span>
            ) : (
              <span />
            )}

            {/* Precios */}
            <span className="flex text-2xl gap-1 rounded-lg ml-auto items-baseline leading-none">
              {hasDiscount && (
                <s className="text-[#8A8A8A] text-xl font-normal leading-none">
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
