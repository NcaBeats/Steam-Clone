"use server";

import { fetchAPI } from "@/lib/api/fetch";
import type { User } from "@/types";

export async function getCurrentUserAction(): Promise<User | null> {
  try {
    const user = await fetchAPI<User>("/users/me", { auth: true });
    return user;
  } catch {
    return null;
  }
}
