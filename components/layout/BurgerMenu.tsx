"use client";

import {
  Menu,
  X,
  House,
  Gamepad2,
  LogIn,
  ClipboardPenLine,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { logoutAction } from "@/actions/logout";

interface BurgerMenuProps {
  readonly isLoggedIn: boolean;
}

export const BurgerMenu = ({ isLoggedIn }: BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="sm:hidden flex items-center ml-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar Menú" : "Abrir Menú"}
        aria-expanded={isOpen}
        className="hover:bg-[#111111] active:bg-[#111111] rounded-md p-1"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <div
        className={`inset-0 fixed bg-black/50 top-16 z-40  transition-opacity duration-300 ease-in-out
      ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      <nav
        className={`
    p-1.5 overflow-hidden rounded-tl-xl z-50 fixed top-18 right-0 bottom-0 bg-[#0A0A0A] border-solid border-l border-t border-l-[#2D2D2D] border-t-[#2D2D2D] w-2/3
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
`}
      >
        <ul
          className="[&_a]:items-center [&_button]:items-center flex flex-col text-[#FAFAFA] [&_li]:rounded-lg
        [&_a]:flex [&_a]:gap-2 [&_a]:py-4 [&_li]:px-4 [&_a]:hover:text-[#007AFF] [&_a]:active:text-[#007AFF]
        [&_a]:hover:underline [&_a]:active:underline [&_li]:hover:bg-[#111111] [&_li]:active:bg-[#111111]"
        >
          <li>
            <Link onClick={() => setIsOpen(!isOpen)} href="/">
              <House />
              Home
            </Link>
          </li>
          <li>
            <Link onClick={() => setIsOpen(!isOpen)} href="/library">
              <Gamepad2 />
              Library
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  logoutAction();
                }}
                className="flex gap-2 py-4 w-full hover:text-[#007AFF] active:text-[#007AFF] hover:underline active:underline"
              >
                <LogOut />
                Log out
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link onClick={() => setIsOpen(!isOpen)} href="/sign-up">
                  <ClipboardPenLine />
                  Sign up
                </Link>
              </li>
              <li>
                <Link onClick={() => setIsOpen(!isOpen)} href="/log-in">
                  <LogIn />
                  Log in
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};
