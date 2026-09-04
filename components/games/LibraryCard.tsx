import { Game } from "@/types";
import Image from "next/image";
import Link from "next/link";

type Props = Readonly<Pick<Game, "id" | "name" | "imageUrl">>;

export const LibraryCard = ({ id, name, imageUrl }: Props) => {
  return (
    <Link
      href={`/games/${id}`}
      aria-label={name}
      className="select-none cursor-pointer shadow-md shadow-[#00000089] group
        transition-all hover:scale-104 active:scale-104
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
    </Link>
  );
};
