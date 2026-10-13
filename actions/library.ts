"use server";

import { fetchAPI } from "@/lib/api/fetch";
import { fetchOrNull } from "@/lib/api/errors";
import type { Library } from "@/types";

export async function getMyLibraryAction(): Promise<Library[]> {
  // Sin sesión la biblioteca es vacía; un fallo de API se propaga para no
  // ocultar juegos del usuario.
  return (
    (await fetchOrNull(async () => { const p = await fetchAPI<{ content: Library[] }>("/library?size=50", { auth: true }); return p.content; })) ?? []
  );
}


