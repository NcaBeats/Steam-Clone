"use client";

import { usePathname } from "next/navigation";
import { Receipt, ShoppingBag, LogOut } from "lucide-react";
import {
  BurgerMenu,
  type BurgerMenuItem,
} from "@/components/layout/BurgerMenu";
import { logoutAction } from "@/actions/logout";

export const StudioBurgerMenu = () => {
  const pathname = usePathname();

  const items: BurgerMenuItem[] = [
    { href: "/studio/games", label: "Products", icon: ShoppingBag },
    { href: "/studio/orders", label: "Orders", icon: Receipt },
    { label: "Log out", icon: LogOut, action: () => logoutAction() },
  ];

  return <BurgerMenu items={items} side="left" activePath={pathname} />;
};
