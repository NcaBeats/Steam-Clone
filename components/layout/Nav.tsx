import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { NavBarLinks, SearchBar, BurgerMenu } from "../layout";

export const Nav = () => {
  return (
    <nav className="flex items-center h-full px-4 gap-6 ">
      <div className="">
        <Link href="/" className="block h-8">
          <Image
            src={"Logo.svg"}
            width={128}
            height={128}
            alt="Steam Logo"
            className="w-auto h-8"
          />
        </Link>
      </div>
      <NavBarLinks />
      <SearchBar />
      <div className="sm:flex hidden justify-end items-center gap-4 ml-auto">
        <Button className="bg-[#0A0A0A] text-[#EDEDED] border border-[#2E2E2E] hover:bg-[#2E2E2E]">
          Sign Up
        </Button>
        <Button className="bg-[#EDEDED] text-black hover:bg-[#d6d6d6]">
          Log In
        </Button>
      </div>
      <BurgerMenu />
    </nav>
  );
};
