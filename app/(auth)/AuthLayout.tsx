"use client";

import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { Erica_One } from "next/font/google";

interface AuthLayoutProps {
  readonly children: React.ReactNode;
}

const ericaOne = Erica_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-erica-one",
});

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#101014] p-4">
      <Link
        className="absolute left-4 top-4 rounded-md p-2 text-[#EDEDED] transition-colors duration-200 ease-out hover:bg-[#28282C] md:fixed"
        href="/"
      >
        <CornerUpLeft />
      </Link>

      <div className="flex w-full flex-col items-center gap-5 p-8 text-center">
        <h1 className={`text-6xl ${ericaOne.className} text-white`}>MBR</h1>

        {children}
      </div>
    </div>
  );
};
