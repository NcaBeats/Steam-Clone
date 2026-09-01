import type { Auth } from "@/types";
import { fetchAPI, setTokenCookie, deleteTokenCookie } from "./client";

export async function login(email: string, password: string) {
  const data = await fetchAPI<Auth>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  await setTokenCookie(data.token);
}

export async function logout() {
  try {
    await fetchAPI("/auth/logout", { method: "POST", auth: true });
  } catch {}
  await deleteTokenCookie();
}
