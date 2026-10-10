"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib";

export const PriceFilter = () => {
  const [range, setRange] = useState<[number, number]>([25, 50]);

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#FAFAFA]">Filters</h2>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-[#8A8A8A]">
          Price range:{" "}
          <span className="text-[#FAFAFA] font-semibold">
            {formatPrice(range[0])} – {formatPrice(range[1])}
          </span>
        </p>
        <Slider
          defaultValue={[25, 50]}
          value={range}
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              setRange((prev) => [value[0] ?? prev[0], value[1] ?? prev[1]]);
            }
          }}
          max={100}
          step={5}
          className="mx-auto w-full max-w-xs"
          aria-label="Price range"
        />
      </div>
    </div>
  );
};
