import { cookies } from "next/headers";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import {
  NavBarLinks,
  SearchBar,
  BurgerMenu,
  WalletBalance,
  type BurgerMenuItem,
} from "@/components/layout";
import { logoutAction } from "@/actions/logout";
import { getCurrentUserAction } from "@/actions/admin/auth";
import { getMyWalletAction } from "@/actions/wallet";
import { Erica_One } from "next/font/google";

const ericaOne = Erica_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-erica-one",
});

export const Nav = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("token")?.value;
  const user = isLoggedIn ? await getCurrentUserAction() : null;
  const wallet = isLoggedIn ? await getMyWalletAction() : null;
  const isStaff = user?.role === "ADMIN" || user?.role === "VENDEDOR";
  const staffHref = user?.role === "ADMIN" ? "/admin" : "/studio/games";

  const menuItems: BurgerMenuItem[] = [
    { href: "/", label: "Home", icon: "house" },
    { href: "/catalog", label: "Catalog", icon: "layoutGrid" },
    { href: "/about", label: "About", icon: "info" },
    { href: "/contact", label: "Contact", icon: "mail" },
    { href: "/blog", label: "Blog", icon: "newspaper" },
    ...(isLoggedIn
      ? [{ href: "/library", label: "Library", icon: "gamepad2" }]
      : []),
    ...(isStaff
      ? [{ href: staffHref, label: "Panel", icon: "layoutDashboard" }]
      : []),
    { href: "/cart", label: "Cart", icon: "shoppingCart" },
    ...(isLoggedIn
      ? [
          {
            href: "/",
            label: "Log out",
            icon: "logOut",
            action: logoutAction,
          },
        ]
      : [
          { href: "/sign-up", label: "Sign up", icon: "clipboardPenLine" },
          { href: "/log-in", label: "Log in", icon: "logIn" },
        ]),
  ];

  return (
    <nav className="text-sm flex items-center h-full px-4 gap-6 ">
      <div className="">
        <Link href="/" className="block items-center min-h-full">
          <h1
            className={`text-3xl hover:text-[#a5a5a5] transition-colors ease-in-out duration-100 ${ericaOne.className}`}
          >
            MBR
          </h1>
        </Link>
      </div>
      <NavBarLinks
        isLoggedIn={isLoggedIn}
        isStaff={isStaff}
        staffHref={staffHref}
      />
      <SearchBar />
      <div className="sm:flex hidden justify-end items-center gap-4 ml-auto">
        {wallet && <WalletBalance initialBalance={wallet.balance} />}
        <Link
          href="/cart"
          className="hover:bg-[#28282C] active:bg-[#28282C] rounded-full p-2.5"
          aria-label="Cart"
        >
          <ShoppingCart size={20} />
        </Link>
        {isLoggedIn ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="bg-[#28282C] hover:bg-[#404044] text-[#FAFAFA] rounded-full px-4 py-1.5 font-medium cursor-pointer transition-colors duration-200 ease-out"
            >
              Log out
            </button>
          </form>
        ) : (
          <>
            <Link
              href={"/sign-up"}
              className="bg-[#28282C] hover:bg-[#404044] text-[#EDEDED] px-4 py-1.5 font-medium text-sm text-center rounded-full cursor-pointer transition-colors duration-200 ease-out"
            >
              Sign Up
            </Link>
            <Link
              href={"/log-in"}
              className="bg-[#EDEDED] text-[#0A0A0A] border hover:bg-[#b0b0b0] px-4 py-1.5 font-medium text-sm text-center rounded-full cursor-pointer transition-colors duration-200 ease-out"
            >
              Log In
            </Link>
          </>
        )}
      </div>
      <BurgerMenu items={menuItems} />
    </nav>
  );
};
