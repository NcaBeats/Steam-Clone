"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Users,
  House,
  LogOut,
} from "lucide-react";
import {
  BurgerMenu,
  type BurgerMenuItem,
} from "@/components/layout/BurgerMenu";
import { logoutAction } from "@/actions/logout";

export const AdminBurgerMenu = () => {
  const pathname = usePathname();

  const items: BurgerMenuItem[] = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/games", label: "Products", icon: ShoppingBag },
    { href: "/admin/orders", label: "Orders", icon: Receipt },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/", label: "Back to site", icon: House },
    { label: "Log out", icon: LogOut, action: () => logoutAction() },
  ];

  return <BurgerMenu items={items} side="left" activePath={pathname} />;
};
