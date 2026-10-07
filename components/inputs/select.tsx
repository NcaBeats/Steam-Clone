import * as React from "react";

import { cn } from "@/lib/utils";

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "w-full min-w-0 rounded-lg bg-[#1A1A1A] px-3 py-3 text-sm font-medium text-[#FAFAFA] transition-colors duration-200 ease-out hover:bg-[#272727] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1A1A1A]",
        className,
      )}
      {...props}
    />
  );
}

export { Select };
