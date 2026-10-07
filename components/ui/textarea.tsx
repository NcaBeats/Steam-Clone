import * as React from "react";

import { cn } from "@/lib/utils";
import { textareaBase } from "@/lib/ui";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaBase, className)}
      {...props}
    />
  );
}

export { Textarea };
