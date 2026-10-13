import type { Comuna, Region } from "@/types";
import { ApiError } from "./errors";
import { API_BASE } from "./config";

export async function getRegionsClient(): Promise<Region[]> {
  const res = await fetch(`${API_BASE}/regions`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || `Regions failed: ${res.status}`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new ApiError(
      res.status,
      "Unexpected response shape from regions endpoint",
    );
  }
  return data as Region[];
}

export async function getComunasClient(regionId: number): Promise<Comuna[]> {
  const res = await fetch(`${API_BASE}/regions/${regionId}/comunas`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, text || `Comunas failed: ${res.status}`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new ApiError(
      res.status,
      "Unexpected response shape from comunas endpoint",
    );
  }
  return data as Comuna[];
}
