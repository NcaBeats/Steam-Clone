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

type MediaMetadata = GameCreateInput;

function readMetadata(formData: FormData): MediaMetadata {
  return {
    name: formData.get("name")?.toString() ?? "",
    originalPrice: Number(formData.get("originalPrice") ?? 0),
    discountPercent: Number(formData.get("discountPercent") ?? 0),
    description: formData.get("description")?.toString() ?? "",
    state: (formData.get("state")?.toString() ??
      "AVAILABLE") as GameCreateInput["state"],
    launchDate: formData.get("launchDate")?.toString() ?? "",
    categoryNames: formData.getAll("categories").map(String),
  };
}

function toFile(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

function toFileList(formData: FormData): File[] {
  return formData
    .getAll("gallery")
    .filter((f): f is File => f instanceof File && f.size > 0);
}

function toMetadataPart(metadata: MediaMetadata): Blob {
  return new Blob([JSON.stringify(metadata)], { type: "application/json" });
}

export async function createGameWithMediaAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const metadata = readMetadata(formData);
  const image = toFile(formData.get("image"));
  if (!image) {
    return { ok: false, error: "La imagen principal es obligatoria" };
  }
  const backend = new FormData();
  backend.append("metadata", toMetadataPart(metadata));
  backend.append("image", image);
  const banner = toFile(formData.get("banner"));
  if (banner) backend.append("banner", banner);
  const video = toFile(formData.get("video"));
  if (video) backend.append("video", video);
  for (const g of toFileList(formData)) {
    backend.append("gallery", g);
  }
  try {
    await fetchAPI<Game>("/games", {
      method: "POST",
      body: backend,
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/games");
    revalidatePath("/studio/games");
    revalidatePath("/admin");
    revalidatePath("/studio");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function updateGameWithMediaAction(
  id: number,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const metadata = readMetadata(formData);
  const backend = new FormData();
  backend.append("metadata", toMetadataPart(metadata));
  const image = toFile(formData.get("image"));
  if (image) backend.append("image", image);
  const banner = toFile(formData.get("banner"));
  if (banner) backend.append("banner", banner);
  const video = toFile(formData.get("video"));
  if (video) backend.append("video", video);
  for (const g of toFileList(formData)) {
    backend.append("gallery", g);
  }
  try {
    await fetchAPI<Game>(`/games/${id}`, {
      method: "PUT",
      body: backend,
      auth: true,
      noStore: true,
    });
    revalidatePath("/admin/games");
    revalidatePath(`/admin/games/${id}`);
    revalidatePath("/studio/games");
    revalidatePath(`/studio/games/${id}`);
    revalidatePath("/admin");
    revalidatePath("/studio");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
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
