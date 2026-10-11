"use client";

import { useEffect, useState } from "react";
import { getComunasClient, getRegionsClient } from "@/lib/api/regions";
import type { Comuna, Region } from "@/types";

/**
 * Catálogo de regiones del backend (texto bonito, listo para UI).
 * Carga una vez al montar.
 */
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

/**
 * Comunas de una región. Se recarga cada vez que cambia `regionId`;
 * con `null` devuelve lista vacía.
 */
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

  // Sin setState síncrono en el efecto: loading y lista se derivan de qué
  // región ya resolvió.
  const settled = loadedFor === regionId;
  return {
    comunas: regionId && settled ? comunas : [],
    loading: !!regionId && !settled,
  };
}
