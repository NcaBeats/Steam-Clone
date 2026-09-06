"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUserAction } from "@/actions/admin/auth";
import type { User, UserRole } from "@/types";

export async function requireRole(
  roles: UserRole[],
  redirectTo?: string,
): Promise<User> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/log-in");
  }

  const user = await getCurrentUserAction();

  if (!user) {
    redirect("/log-in");
  }

  if (!roles.includes(user.role)) {
    redirect(redirectTo ?? "/");
  }

  return user;
}

export async function requireAdmin(): Promise<void> {
  await requireRole(["ADMIN"]);
}
