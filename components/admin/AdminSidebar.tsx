"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const items: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Products", icon: ShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/users", label: "Users", icon: Users },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex w-56 bg-[#0A0A0A] border-r border-[#2A2A2A] h-screen sticky top-0 flex-col p-4 gap-1">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="size-8 bg-[#007AFF] rounded-lg flex items-center justify-center text-white font-bold text-sm">
          MBR
        </div>
        <span className="font-semibold text-[#FAFAFA]">Dashboard</span>
      </div>
      <nav className="flex flex-col gap-2 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
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
      <div className="mt-auto border-t border-[#2A2A2A] pt-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#8A8A8A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
        >
          <House size={16} />
          Back to site
        </Link>
      </div>
    </aside>
  );
};
