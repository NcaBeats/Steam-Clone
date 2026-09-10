"use server";

import { fetchAPI } from "@/lib/api/fetch";
import { fetchOrNull } from "@/lib/api/errors";
import type { Library } from "@/types";

export async function getMyLibraryAction(): Promise<Library[]> {
  return (
    (await fetchOrNull(() =>
      fetchAPI<Library[]>("/library?size=50", { auth: true, revalidate: 0 }),
    )) ?? []
  );
}
