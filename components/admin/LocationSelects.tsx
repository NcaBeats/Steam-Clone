"use client";

import { useMemo, useEffect } from "react";
import { Select } from "@/components/ui";
import regiones from "@/data/regiones.json";

const COMUNAS_BY_REGION: Record<string, string[]> = regiones.reduce(
  (acc, region) => {
    acc[region.nombre] = region.comunas;
    return acc;
  },
  {} as Record<string, string[]>,
);

const ALL_COMUNAS: string[] = regiones.reduce((acc, region) => {
  acc.push(...region.comunas);
  return acc;
}, [] as string[]);

export type Region =
  | "ARICA_Y_PARINACOTA"
  | "TARAPACA"
  | "ANTOFAGASTA"
  | "ATACAMA"
  | "COQUIMBO"
  | "VALPARAISO"
  | "METROPOLITANA_DE_SANTIAGO"
  | "O_HIGGINS"
  | "MAULE"
  | "NUBLE"
  | "BIOBIO"
  | "ARAUCANIA"
  | "LOS_RIOS"
  | "LOS_LAGOS"
  | "AYSEN"
  | "MAGALLANES";

export type Comuna = string;

const REGION_LABELS: Record<Region, string> = {
  ARICA_Y_PARINACOTA: "Arica y Parinacota",
  TARAPACA: "Tarapacá",
  ANTOFAGASTA: "Antofagasta",
  ATACAMA: "Atacama",
  COQUIMBO: "Coquimbo",
  VALPARAISO: "Valparaíso",
  METROPOLITANA_DE_SANTIAGO: "Metropolitana de Santiago",
  O_HIGGINS: "O'Higgins",
  MAULE: "Maule",
  NUBLE: "Ñuble",
  BIOBIO: "Biobío",
  ARAUCANIA: "Araucanía",
  LOS_RIOS: "Los Ríos",
  LOS_LAGOS: "Los Lagos",
  AYSEN: "Aysén",
  MAGALLANES: "Magallanes",
};

const ALL_REGIONS = Object.keys(REGION_LABELS) as Region[];

export type RegionSelectProps = Readonly<{
  name: string;
  placeholder?: string;
  value?: Region | "";
  defaultValue?: Region | "";
  onValueChange?: (value: Region) => void;
  className?: string;
}>;

export function RegionSelect({
  name,
  placeholder = "Select a region",
  value,
  defaultValue,
  onValueChange,
  className,
}: RegionSelectProps) {
  return (
    <Select
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onValueChange?.(e.target.value as Region)}
      className={className ?? ""}
    >
      <option value="">{placeholder}</option>
      {ALL_REGIONS.map((region) => (
        <option key={region} value={region}>
          {REGION_LABELS[region]}
        </option>
      ))}
    </Select>
  );
}

export type ComunaSelectProps = Readonly<{
  name: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  region?: Region | "";
  onValueChange?: (value: string) => void;
  className?: string;
}>;

export function ComunaSelect({
  name,
  placeholder = "Select a municipality",
  value,
  defaultValue,
  region,
  onValueChange,
  className,
}: ComunaSelectProps) {
  const comunas = useMemo(() => {
    if (region && COMUNAS_BY_REGION[region]) {
      return COMUNAS_BY_REGION[region];
    }
    return ALL_COMUNAS;
  }, [region]);

  // If region changes, reset to first comuna to avoid stale selection
  useEffect(() => {
    if (region && defaultValue) {
      const valid = COMUNAS_BY_REGION[region]?.includes(defaultValue);
      if (!valid) onValueChange?.("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  return (
    <Select
      name={name}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={className ?? ""}
    >
      <option value="">{placeholder}</option>
      {comunas.map((comuna) => (
        <option key={comuna} value={comuna}>
          {comuna}
        </option>
      ))}
    </Select>
  );
}

export const REGION_NAMES = ALL_REGIONS;
export const REGION_DISPLAY = REGION_LABELS;
