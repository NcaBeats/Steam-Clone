"use server";

import { cookies } from "next/headers";
import { fetchAPI } from "@/lib/api/fetch";

const COOKIE_NAME = "token";

export async function logoutAction() {
  try {
    await fetchAPI("/auth/logout", { method: "POST", auth: true });
  } catch {}
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
