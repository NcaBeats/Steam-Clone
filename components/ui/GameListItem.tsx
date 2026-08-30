import Image from "next/image";
import { Gamepad2, Trophy, BadgeCheck } from "lucide-react";

export const GameListItem = () => {
  return (
    <div className="group flex relative transition-transform hover:scale-101 active:scale-101">
      <Image
        src={"/images/Silksong.webp"}
        alt="Item-1"
        width={1920}
        height={1080}
        className="aspect-3/4 object-cover w-25"
      />
      <div
        className="flex flex-col p-2 bg-[#161617] gap-1 w-full justify-center
          group-active:bg-[#EDEDED] group-hover:bg-[#EDEDED] active:transition-colors
           group-active:text-black group-hover:text-black duration-200 ease-in
            [&___]"
      >
        <h3 className="text-sm font-medium">Nombre del Juego</h3>
        <h4 className="text-xs">
          Acción-aventura, Metroidvania, Plataformas en 2D, Soulsvania
        </h4>
        <p className="text-xs text-[#8A8A8A]">Lanzamiento: 4 SEP 2025</p>
        <div className="flex justify-between">
          <ul className="flex gap-1 [&_li]:text-[#007AFF]">
            <li>
              <Gamepad2 size={20} />
            </li>
            <li>
              <Trophy size={20} />
            </li>
            <li>
              <BadgeCheck size={20} />
            </li>
          </ul>
          <div className="transition-colors ease-in group-active:bg-[#007AFF] group-hover:bg-[#007AFF] overflow-hidden rounded-lg ml-2.5 justify-center relative flex text-[#534000] bg-[#FCE100] items-center">
            <span className="group-active:text-[#EDEDED] group-hover:text-[#EDEDED] flex flex-1 text-center px-2 py-1 text-sm font-medium whitespace-nowrap gap-1">
              $7.875
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
