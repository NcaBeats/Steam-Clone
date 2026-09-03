"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { RegionData } from "@/types";

interface RegionSelectProps {
  readonly regiones: RegionData[];
  readonly defaultRegion?: string;
  readonly defaultComuna?: string;
  readonly regionError?: string[];
  readonly comunaError?: string[];
  readonly layout?: "stacked" | "inline";
  readonly className?: string;
}

export const RegionSelect = ({
  regiones,
  defaultRegion = "",
  defaultComuna = "",
  regionError,
  comunaError,
  layout = "stacked",
  className,
}: RegionSelectProps) => {
  const [region, setRegion] = useState(defaultRegion);
  const [comuna, setComuna] = useState(defaultComuna);

  const comunas = regiones.find((r) => r.nombre === region)?.comunas ?? [];

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
    setComuna("");
  };

  const regionSelect = (
    <div className={layout === "inline" ? "flex-1" : ""}>
      <div className="relative">
        <select
          name="region"
          value={region}
          onChange={handleRegionChange}
          required
          className="appearance-none bg-[#1A1A1A] rounded-lg px-3 py-3 pr-10 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full"
        >
          <option value="">Select a region</option>
          {regiones.map((r) => (
            <option key={r.nombre} value={r.nombre}>
              {r.nombre}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] pointer-events-none"
        />
      </div>
      <div className="min-h-5">
        {regionError && (
          <p className="text-red-500 text-xs mt-1 italic">{regionError[0]}</p>
        )}
      </div>
    </div>
  );

  const comunaSelect = (
    <div className={layout === "inline" ? "flex-1" : ""}>
      <div className="relative">
        <select
          name="comuna"
          value={comuna}
          onChange={(e) => setComuna(e.target.value)}
          required
          disabled={!region}
          className="appearance-none bg-[#1A1A1A] rounded-lg px-3 py-3 pr-10 text-[#FAFAFA] font-medium text-sm hover:bg-[#272727] transition-colors duration-200 ease-out w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {region ? "Select a municipality" : "Select a region first"}
          </option>
          {comunas.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] pointer-events-none"
        />
      </div>
      <div className="min-h-5">
        {comunaError && (
          <p className="text-red-500 text-xs mt-1 italic">{comunaError[0]}</p>
        )}
      </div>
    </div>
  );

  if (layout === "inline") {
    return (
      <div className={`flex gap-4 ${className}`}>
        {regionSelect}
        {comunaSelect}
      </div>
    );
  }

  return (
    <>
      {regionSelect}
      {comunaSelect}
    </>
  );
};
