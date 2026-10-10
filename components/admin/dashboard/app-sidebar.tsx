"use client";

import Link from "next/link";
import * as React from "react";
import { HouseIcon, LogOutIcon } from "lucide-react";
import { logoutAction } from "@/actions/logout";
import { NavMain, type DashboardNavItem } from "./nav-main";
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

export function AppSidebar({
  items,
  user,
  ...props
}: {
  items: DashboardNavItem[];
  user: {
    email: string;
    role: string;
  };
} & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/" />}>
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#007AFF] text-sm font-bold text-white">
                MBR
              </span>
              <span className="text-base font-semibold">Panel</span>
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
