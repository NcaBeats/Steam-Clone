import { cn } from "@/lib/utils";

export const baseField =
  "w-full min-w-0 bg-[#1A1A1A] px-3 py-3 text-sm font-medium text-[#FAFAFA] transition-colors duration-200 ease-out hover:bg-[#272727] placeholder:text-[#5A5A5A] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1A1A1A]";

export const inputBase = cn(
  baseField,
  "rounded-md file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#FAFAFA]"
);

export const textareaBase = cn(baseField, "rounded-lg resize-y");
