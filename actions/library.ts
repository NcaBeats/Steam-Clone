"use server";

import { fetchAPI } from "@/lib/api/fetch";
import { fetchOrNull } from "@/lib/api/errors";
import type { Library } from "@/types";

export async function getMyLibraryAction(): Promise<Library[]> {
  // Sin sesion la biblioteca es vacia de verdad. Un fallo de la API en cambio
  // se propaga: devolver [] ante un 500 hidingaria que el usuario perdio sus
  // juegos, que es la peor forma de mentir en esta pantalla.
  return (
    (await fetchOrNull(() =>
      fetchAPI<Library[]>("/library?size=50", {
        auth: true,
        revalidate: 0,
        responseShape: "list",
      }),
    )) ?? []
  );
}
