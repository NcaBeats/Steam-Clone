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
import { useState, useEffect, type ReactNode } from "react";

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  const sideClasses =
    side === "left"
      ? "left-0 rounded-tr-xl border-r border-t border-r-[#2D2D2D] border-t-[#2D2D2D]"
      : "right-0 rounded-tl-xl border-l border-t border-l-[#2D2D2D] border-t-[#2D2D2D]";

  const hiddenClass =
    side === "left" ? "-translate-x-full" : "translate-x-full";

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
    <div
      className={`sm:hidden flex items-center ${
        side === "left" ? "mr-auto" : "ml-auto"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="hover:bg-[#28282C] active:bg-[#28282C] rounded-md p-1"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`inset-0 fixed bg-black/50 top-[72px] z-40  transition-opacity duration-300 ease-in-out
      ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <nav
        className={`
    p-1.5 overflow-hidden z-50 fixed top-[72px] bottom-0 bg-[#101014] border-solid w-2/3 ${sideClasses}
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0 pointer-events-auto" : `${hiddenClass} pointer-events-none`}
`}
      >
        <ul
          className="[&_a]:items-center [&_button]:items-center flex flex-col text-[#FAFAFA] [&_li]:rounded-md
        [&_a]:flex [&_a]:gap-2 [&_a]:py-4 [&_li]:px-4 [&_a]:hover:text-white [&_a]:active:text-white
        [&_a]:hover:underline [&_a]:active:underline [&_li]:hover:bg-[#28282C] [&_li]:active:bg-[#28282C]"
        >
          {items.map((item) => (
            <li key={`${item.label}-${item.href ?? item.action?.name ?? ""}`}>
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
