"use server";

import { fetchAPI } from "@/lib/api/fetch";
import type { Library } from "@/types";

export async function getMyLibraryAction(): Promise<Library[]> {
  try {
    return await fetchAPI<Library[]>("/library?size=50", {
      auth: true,
      revalidate: 0,
    });
  } catch {
    return [];
  }
}
