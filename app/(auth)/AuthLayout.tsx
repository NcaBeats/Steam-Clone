"use client";

import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { Erica_One } from "next/font/google";

interface AuthLayoutProps {
  readonly formAction: (formData: FormData) => void;
  readonly children: React.ReactNode;
}

const ericaOne = Erica_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-erica-one",
});

export const AuthLayout = ({ formAction, children }: AuthLayoutProps) => {
  return (
    <div className="bg-[#101014] flex text-center justify-center items-center min-h-screen p-4">
      <Link
        className="md:fixed absolute left-4 top-4 text-[#EDEDED] hover:bg-[#28282C] p-2 rounded-md transition-colors duration-200 ease-out"
        href="/"
      >
        <CornerUpLeft />
      </Link>
      <form
        action={formAction}
        className="flex flex-col gap-5 w-full max-w-md p-8 rounded-3xl bg-[#202024] border border-white/[0.06]"
      >
        <h1 className={`text-6xl ${ericaOne.className}`}>MBR</h1>
        {children}
      </form>
    </div>
  );
};
