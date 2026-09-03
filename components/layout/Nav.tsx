import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { NavBarLinks, SearchBar, BurgerMenu } from "@/components/layout";
import { logoutAction } from "@/actions/logout";

export const Nav = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("token")?.value;

  return (
    <nav className="text-sm flex items-center h-full px-4 gap-6 ">
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
        {isLoggedIn ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="bg-[#EDEDED] text-black rounded-md px-3 py-1.5 font-medium hover:bg-[#7b7b7b] cursor-pointer"
            >
              Log out
            </button>
          </form>
        ) : (
          <>
            <Link
              href={"/sign-up"}
              className="bg-[#0A0A0A] text-[#EDEDED] border border-[#2E2E2E]
                         hover:bg-[#2E2E2E] px-3 py-1.5 font-medium text-sm text-center rounded-md  cursor-pointer transition-colors duration-250 ease-out"
            >
              Sign Up
            </Link>
            <Link
              href={"/log-in"}
              className="bg-[#EDEDED] text-[#0A0A0A] border
                         hover:bg-[#b0b0b0] px-3 py-1.5 font-medium text-sm text-center rounded-md  cursor-pointer transition-colors duration-250 ease-out"
            >
              Log In
            </Link>
          </>
        )}
      </div>
      <BurgerMenu isLoggedIn={isLoggedIn} />
    </nav>
  );
};
