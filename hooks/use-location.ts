"use client";

import { useEffect, useState } from "react";
import { getComunasClient, getRegionsClient } from "@/lib/api/regions";
import type { Comuna, Region } from "@/types";

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getRegionsClient()
      .then((data) => {
        if (alive) setRegions(data);
      })
      .catch(() => {
        if (alive) setError("Could not load regions");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { regions, loading, error };
}

export function useComunas(regionId: number | null) {
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [loadedFor, setLoadedFor] = useState<number | null>(null);

  useEffect(() => {
    if (!regionId) return;
    let alive = true;
    getComunasClient(regionId)
      .then((data) => {
        if (!alive) return;
        setComunas(data);
        setLoadedFor(regionId);
      })
      .catch(() => {
        if (!alive) return;
        setComunas([]);
        setLoadedFor(regionId);
      });
    return () => {
      alive = false;
    };
  }, [regionId]);

  const settled = loadedFor === regionId;
  return {
    comunas: regionId && settled ? comunas : [],
    loading: !!regionId && !settled,
  };
}
