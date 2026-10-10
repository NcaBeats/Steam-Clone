"use client";

import Link from "next/link";
import * as React from "react";
import { Erica_One } from "next/font/google";
import {
  HouseIcon,
  LogOutIcon,
  Newspaper,
  Receipt,
  ShoppingBag,
  Users,
} from "lucide-react";
import { logoutAction } from "@/actions/logout";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { DashboardNavItem } from "./nav-main";

const ericaOne = Erica_One({
  weight: "400",
  subsets: ["latin"],
});

const ADMIN_ITEMS: DashboardNavItem[] = [
  { title: "Products", url: "/admin/games", icon: ShoppingBag },
  { title: "Blogs", url: "/admin/blogs", icon: Newspaper },
  { title: "Orders", url: "/admin/orders", icon: Receipt },
  { title: "Users", url: "/admin/users", icon: Users },
];

const STUDIO_ITEMS: DashboardNavItem[] = [
  { title: "Products", url: "/studio/games", icon: ShoppingBag },
  { title: "Orders", url: "/studio/orders", icon: Receipt },
];

export function AppSidebar({
  variant,
  user,
  ...props
}: {
  variant: "admin" | "studio";
  user: {
    email: string;
    role: string;
  };
} & Omit<React.ComponentProps<typeof Sidebar>, "variant">) {
  const items = variant === "admin" ? ADMIN_ITEMS : STUDIO_ITEMS;

  return (
    <Sidebar collapsible="offcanvas" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />}>
              <span className={`text-2xl text-white ${ericaOne.className}`}>
                MBR
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
        <NavSecondary
          items={[
            {
              title: "Back to site",
              url: "/",
              icon: <HouseIcon />,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
        <form action={logoutAction}>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<button type="submit" />}
                className="w-full cursor-pointer"
              >
                <LogOutIcon />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
