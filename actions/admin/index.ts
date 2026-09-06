"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchAPI } from "@/lib/api/fetch";
import type {
  Game,
  User,
  UserCreateInput,
  GameCreateInput,
  AdminUserUpdateInput,
  GameUpdateInput,
  AdminUser,
  Profile,
} from "@/types";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Error";
}

export async function deleteUserAction(): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    await fetchAPI(`/users`, {
      method: "DELETE",
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteUserByIdAction(
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await fetchAPI(`/users/${id}`, {
      method: "DELETE",
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function createUserAction(
  input: UserCreateInput,
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const user = await fetchAPI<User>("/users", {
      method: "POST",
      body: { email: input.email, password: input.password },
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function deleteGameAction(
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await fetchAPI(`/games/${id}`, {
      method: "DELETE",
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/games");
    revalidatePath("/admin");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function createGameAction(
  input: GameCreateInput,
): Promise<{ ok: boolean; game?: Game; error?: string }> {
  try {
    const game = await fetchAPI<Game>("/games", {
      method: "POST",
      body: {
        name: input.name,
        originalPrice: input.originalPrice,
        discountPercent: input.discountPercent,
        description: input.description,
        state: input.state,
        launchDate: input.launchDate,
        categoryNames: input.categoryNames,
      },
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/games");
    revalidatePath("/admin");
    return { ok: true, game };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function createUserFromFormAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const run = formData.get("run")?.toString() ?? "";
  const firstName = formData.get("firstName")?.toString() ?? "";
  const lastName = formData.get("lastName")?.toString() ?? "";
  const birthDate = formData.get("birthDate")?.toString() ?? "";
  const region = formData.get("region")?.toString() ?? "";
  const comuna = formData.get("comuna")?.toString() ?? "";
  const address = formData.get("address")?.toString() ?? "";

  const created = await createUserAction({ email, password });
  if (!created.ok || !created.user) {
    return { ok: false, error: created.error };
  }

  const profileResult = await updateUserProfileAction(created.user.id, {
    run,
    firstName,
    lastName,
    birthDate: birthDate || null,
    region: region || null,
    comuna: comuna || null,
    address,
  });
  if (!profileResult.ok) {
    return { ok: false, error: profileResult.error };
  }

  redirect("/admin/users");
}

export async function createGameFromFormAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const name = formData.get("name")?.toString() ?? "";
  const originalPrice = Number(formData.get("originalPrice") ?? 0);
  const discountPercent = Number(formData.get("discountPercent") ?? 0);
  const description = formData.get("description")?.toString() ?? "";
  const state = formData.get("state")?.toString() ?? "AVAILABLE";
  const launchDate = formData.get("launchDate")?.toString() ?? "";
  const categoryNames = formData.getAll("categories").map(String);
  const result = await createGameAction({
    name,
    originalPrice,
    discountPercent,
    description,
    state: state as GameCreateInput["state"],
    launchDate,
    categoryNames,
  });
  if (result.ok) {
    redirect("/admin/games");
  }
  return { ok: result.ok, error: result.error };
}

export async function updateUserAction(
  id: number,
  input: AdminUserUpdateInput,
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const body: Record<string, unknown> = {
      email: input.email,
      role: input.role,
    };
    if (input.password && input.password.length > 0) {
      body.password = input.password;
    }
    const user = await fetchAPI<User>(`/users/${id}`, {
      method: "PUT",
      body,
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);
    revalidatePath("/admin");
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateUserProfileAction(
  id: number,
  input: Partial<Profile>,
): Promise<{ ok: boolean; user?: AdminUser; error?: string }> {
  try {
    const user = await fetchAPI<AdminUser>(`/profile/${id}`, {
      method: "PATCH",
      body: input,
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateGameAction(
  id: number,
  input: GameUpdateInput,
): Promise<{ ok: boolean; game?: Game; error?: string }> {
  try {
    const game = await fetchAPI<Game>(`/games/${id}`, {
      method: "PUT",
      body: {
        name: input.name,
        originalPrice: input.originalPrice,
        discountPercent: input.discountPercent,
        description: input.description,
        state: input.state,
        launchDate: input.launchDate,
        categoryNames: input.categoryNames,
      },
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/games");
    revalidatePath(`/admin/games/${id}`);
    revalidatePath("/admin");
    return { ok: true, game };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}
