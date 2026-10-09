"use client";

import {
  Menu,
  X,
  House,
  Gamepad2,
  LogIn,
  ClipboardPenLine,
  LogOut,
  ShoppingCart,
  LayoutGrid,
  Info,
  Mail,
  Newspaper,
  LayoutDashboard,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/feedback/drawer";

const ICONS: Record<string, LucideIcon> = {
  house: House,
  gamepad2: Gamepad2,
  logIn: LogIn,
  clipboardPenLine: ClipboardPenLine,
  logOut: LogOut,
  shoppingCart: ShoppingCart,
  layoutGrid: LayoutGrid,
  info: Info,
  mail: Mail,
  newspaper: Newspaper,
  layoutDashboard: LayoutDashboard,
  shoppingBag: ShoppingBag,
  users: Users,
};

export type BurgerMenuItem = Readonly<{
  href?: string;
  label: string;
  icon: LucideIcon | string;
  action?: () => void;
}>;

interface BurgerMenuProps {
  readonly items: ReadonlyArray<BurgerMenuItem>;
  readonly side?: "left" | "right";
  readonly activePath?: string;
}

const resolveIcon = (icon: BurgerMenuItem["icon"]): LucideIcon =>
  typeof icon === "string" ? (ICONS[icon] ?? House) : icon;

export const BurgerMenu = ({
  items,
  side = "right",
  activePath,
}: BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  const renderItem = (item: BurgerMenuItem): ReactNode => {
    const Icon = resolveIcon(item.icon);
    if (item.action) {
      return (
        <button
          type="button"
          onClick={() => {
            close();
            item.action?.();
          }}
          className="flex gap-2 py-4 w-full hover:text-white active:text-white hover:underline active:underline"
        >
          <Icon />
          {item.label}
        </button>
      );
    }
    const isActive = !!item.href && item.href === activePath;
    return (
      <Link
        onClick={close}
        href={item.href ?? "#"}
        className={isActive ? "text-white underline" : undefined}
      >
        <Icon />
        {item.label}
      </Link>
    );
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      swipeDirection={side === "left" ? "left" : "right"}
    >
      <div
        className={`min-[960px]:hidden flex items-center ${
          side === "left" ? "mr-auto" : "ml-auto"
        }`}
      >
        <DrawerTrigger
          aria-label="Open menu"
          className="hover:bg-[#28282C] active:bg-[#28282C] rounded-md p-1"
        >
          <Menu size={24} />
        </DrawerTrigger>
      </div>
      <DrawerContent className="[--drawer-content-width:66.6667%] bg-[#101014] text-[#FAFAFA] border-[#2D2D2D]">
        <div className="flex items-center justify-between p-4 pb-0 ml-2">
          <span className="font-semibold text-[#FAFAFA]">Menu</span>
          <DrawerClose
            aria-label="Close menu"
            className="hover:bg-[#28282C] active:bg-[#28282C] rounded-md p-1 cursor-pointer"
          >
            <X size={24} />
          </DrawerClose>
        </div>
        <ul
          className="[&_a]:items-center [&_button]:items-center flex flex-col text-[#FAFAFA] [&_li]:rounded-md
        [&_a]:flex [&_a]:gap-2 [&_a]:py-4 [&_li]:px-4 [&_a]:hover:text-white [&_a]:active:text-white
        [&_a]:hover:underline [&_a]:active:underline [&_li]:hover:bg-[#28282C] [&_li]:active:bg-[#28282C] p-1.5 overflow-y-auto"
        >
          {items.map((item) => (
            <li key={`${item.label}-${item.href ?? item.action?.name ?? ""}`}>
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </DrawerContent>
    </Drawer>
  );
};
