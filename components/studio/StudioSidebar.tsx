"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Receipt, ShoppingBag, type LucideIcon } from "lucide-react";
import { logoutAction } from "@/actions/logout";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  { href: "/studio/games", label: "Products", icon: ShoppingBag },
  { href: "/studio/orders", label: "Orders", icon: Receipt },
];

export const StudioSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex w-56 bg-[#0A0A0A] border-r border-[#2A2A2A] h-screen sticky top-0 flex-col p-4 gap-1">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="size-8 bg-[#007AFF] rounded-lg flex items-center justify-center text-white font-bold text-sm">
          MBR
        </div>
        <span className="font-semibold text-[#FAFAFA]">Panel</span>
      </div>
      <nav className="flex flex-col gap-0.5 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[#007AFF] text-white"
                  : "text-[#8A8A8A] hover:bg-[#1A1A1A] hover:text-white"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <form
        action={logoutAction}
        className="mt-auto border-t border-[#2A2A2A] pt-3"
      >
        <button
          type="submit"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#8A8A8A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Log out
        </button>
      </form>
    </aside>
  );
};
