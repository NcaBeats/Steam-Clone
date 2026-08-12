import { Button } from "@/components/ui/Button";
import { SearchBar } from "./SearchBar";
import Image from "next/image";

export const Nav = () => {
  return (
    <nav className="flex items-center max-w-7xl mx-auto py-4 px-4 gap-4 ">
      <div className="">
        <Image src={"Logo.svg"} width={128} height={128} alt="Steam Logo" />
      </div>

      <div className="flex flex-1 justify-end items-center gap-4">
        <SearchBar></SearchBar>
        <Button className="bg-[#0A0A0A] text-[#EDEDED] border border-[#2E2E2E] hover:bg-[#2E2E2E]">
          Sign Up
        </Button>
        <Button className="bg-[#EDEDED] text-black hover:bg-[#d6d6d6]">
          Log In
        </Button>
      </div>
    </nav>
  );
};
