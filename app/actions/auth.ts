"use server";

import { login as apiLogin, logout as apiLogout } from "@/lib/api";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await apiLogin(email, password);
  } catch {
    return { error: "Credenciales inválidas" };
  }

  redirect("/");
}

export async function logoutAction() {
  await apiLogout();
}
