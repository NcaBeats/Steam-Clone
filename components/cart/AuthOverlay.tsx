"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, LogIn, ClipboardPenLine } from "lucide-react";

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

export const AuthOverlay = ({ open, onClose }: Props) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-overlay-title"
    >
      <div
        className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl w-full max-w-2xs p-6 flex flex-col gap-4 shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-[#8A8A8A] hover:text-white hover:bg-[#2A2A2A] active:bg-[#2A2A2A] rounded-md p-1 cursor-pointer transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-1 items-center text-center">
          <h2
            id="auth-overlay-title"
            className="text-xl font-bold text-[#FAFAFA]"
          >
            Sign in to continue
          </h2>
          <p className="text-sm text-[#8A8A8A]">
            You need an account to complete your purchase.
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <Link
            href="/log-in"
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-[#EDEDED] text-[#0A0A0A] border hover:bg-[#b0b0b0] px-3 py-3 font-semibold text-sm text-center rounded-md cursor-pointer transition-colors duration-200 ease-out"
          >
            <LogIn size={18} />
            Log in
          </Link>
          <Link
            href="/sign-up"
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-[#0A0A0A] text-[#EDEDED] border border-[#2E2E2E] hover:bg-[#2E2E2E] px-3 py-3 font-semibold text-sm text-center rounded-md cursor-pointer transition-colors duration-200 ease-out"
          >
            <ClipboardPenLine size={18} />
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};
