import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 resize-y rounded-lg bg-[#1A1A1A] px-3 py-3 text-sm font-medium text-[#FAFAFA] transition-colors duration-200 ease-out hover:bg-[#272727] placeholder:text-[#5A5A5A] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#1A1A1A]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
