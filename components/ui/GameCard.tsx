import Image from "next/image";

export const GameCard = () => {
  return (
    <div
      className="group transition-all hover:scale-102 active:scale-102 bg-[#17202B] flex flex-col relative overflow-hidden shrink-0
    active:bg-[#EDEDED] hover:bg-[#EDEDED] 
      active:text-black hover:text-black duration-200 ease-in"
    >
      <div className="relative aspect-3/4 overflow-hidden">
        <Image
          src={"/images/Silksong.webp"}
          alt=""
          fill
          className=" snap-start
          object-cover object-center block transition-all duration-300 ease-out
           hover:scale-[1.05] hover:brightness-50 active:scale-[1.05] active:brightness-50"
        />
      </div>

      <div
        className="flex flex-col p-2 gap-1
      "
      >
        <h3 className="text-sm font-medium">Hollow Knight: Silksong</h3>

        <div className="items-center flex justify-between text-sm">
          <span className="transition-colors ease-in group-hover:bg-[#007AFF] group-active:bg-[#007AFF] group-hover:text-white group-active:text-white font-medium bg-[#FCE100] text-[#534000] px-2 py-1 rounded-lg">
            25%
          </span>
          <span className="flex gap-1 rounded-lg ">
            <s className="text-[#8A8A8A]">$10.500</s>
            $7.875
          </span>
        </div>
      </div>
    </div>
  );
};
