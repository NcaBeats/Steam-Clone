"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "cn";

type Props = Readonly<{
  label: string;
  value: Date | null | undefined;
  onChange: (date: Date | undefined) => void;
  disableFuture?: boolean;
}>;

export function DatePickerField({
  label,
  value,
  onChange,
  disableFuture = true,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            aria-label={label}
            className={cn(
              "w-full justify-start text-left font-normal h-10 py-1 border-0",
              !value && "text-muted-foreground",
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 size-4" />
        {value ? format(value, "PPP") : <span>Select date</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={onChange}
          captionLayout="dropdown"
          disabled={disableFuture ? (date) => date > new Date() : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
