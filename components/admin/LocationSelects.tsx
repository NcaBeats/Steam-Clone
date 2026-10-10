import regiones from "@/data/regiones.json";

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

export type RegionOption = {
  key: Region;
  label: string;
};

export const REGION_OPTIONS: RegionOption[] = (
  Object.keys(REGION_LABELS) as Region[]
).map((key) => ({ key, label: REGION_LABELS[key] }));

const COMUNAS_BY_REGION: Record<Region, string[]> = (
  Object.keys(REGION_LABELS) as Region[]
).reduce(
  (acc, key) => {
    const entry = regiones.find(
      (region) => region.nombre === REGION_LABELS[key],
    );
    acc[key] = entry ? [...entry.comunas] : [];
    return acc;
  },
  {} as Record<Region, string[]>,
);

export const getComunasByRegion = (region: Region | ""): string[] =>
  region ? (COMUNAS_BY_REGION[region] ?? []) : [];
