"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib";

export const PRICE_MIN = 0;
export const PRICE_MAX = 100;

type Props = Readonly<{
  min: number;
  max: number;
}>;

export const PriceFilter = ({ min, max }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [range, setRange] = useState<[number, number]>([min, max]);

  const narrowed = min > PRICE_MIN || max < PRICE_MAX;

  const commit = (nextMin: number, nextMax: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", String(nextMin));
    params.set("maxPrice", String(nextMax));
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearParams = new URLSearchParams(searchParams.toString());
  clearParams.delete("minPrice");
  clearParams.delete("maxPrice");
  clearParams.delete("page");
  const clearQs = clearParams.toString();

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
          defaultValue={[min, max]}
          value={range}
          onValueChange={(value) => {
            if (Array.isArray(value)) {
              setRange((prev) => [value[0] ?? prev[0], value[1] ?? prev[1]]);
            }
          }}
          onValueCommitted={(value) => {
            if (Array.isArray(value)) {
              commit(value[0] ?? min, value[1] ?? max);
            }
          }}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5}
          className="mx-auto w-full max-w-xs"
          aria-label="Price range"
        />
        {narrowed && (
          <Link
            href={clearQs ? `${pathname}?${clearQs}` : pathname}
            className="text-xs text-[#007AFF] hover:underline self-start"
          >
            Clear price filter
          </Link>
        )}
      </div>
    </div>
  );
};
