import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-full min-w-0 rounded-md bg-[#1A1A1A] px-3 py-3 text-sm font-medium text-[#FAFAFA] transition-colors duration-200 ease-out hover:bg-[#272727] placeholder:text-[#5A5A5A] file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#FAFAFA] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1A1A1A]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
