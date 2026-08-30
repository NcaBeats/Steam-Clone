import Image from "next/image";

export const GameCard = () => {
  return (
    <div className="flex flex-col relative overflow-hidden rounded-lg shrink-0">
      <div className="relative aspect-3/4">
        <Image
          src={"/images/Silksong.webp"}
          alt=""
          fill
          className=" snap-start
          object-cover object-center block transition-all duration-300 ease-out
           hover:scale-[1.05] hover:brightness-50 active:scale-[1.05] active:brightness-50"
        />
      </div>

      <div className="justify-center relative overflow-hidden flex bg-[#17202B] rounded-b-lg items-center">
        <span className="flex-1 text-center bg-[#FCE100] text-[#534000] font-bold">
          25%
        </span>
        <span className="flex flex-1 text-center px-2 text-sm font-normal whitespace-nowrap gap-1">
          <s className="text-[#B3B2B4]">$10.500</s>
          $7.875
        </span>
      </div>
      <div className="mt-1">Hollow Knight: Silksong</div>
    </div>
  );
};
