"use client";

import { CornerUpLeft } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  readonly formAction: (formData: FormData) => void;
  readonly children: React.ReactNode;
}

export const AuthLayout = ({ formAction, children }: AuthLayoutProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Link
        className="absolute left-6 top-8 hover:bg-[#3a3a3a] p-2 rounded-lg transition-colors duration-200 ease-out"
        href="/"
      >
        <CornerUpLeft />
      </Link>
      <form
        action={formAction}
        className="flex flex-col gap-4 w-90 p-6 rounded-lg"
      >
        {children}
      </form>
    </div>
  );
};
