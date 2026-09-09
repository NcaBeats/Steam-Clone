"use server";

import { revalidatePath } from "next/cache";
import { fetchAPI } from "@/lib/api/fetch";
import { appendMediaFiles, toFile, toJsonPart } from "@/lib/form-data";
import { GameMetadataSchema } from "@/schemas/admin/game.schema";
import { AdminUserCreateSchema } from "@/schemas/admin/user.schema";
import type {
  AdminUser,
  AdminUserUpdateInput,
  Game,
  Profile,
  User,
  UserCreateInput,
} from "@/types";
import type { ZodError } from "zod";

type MutationResult<T> = { ok: true; data: T } | { ok: false; error: string };

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Error";
}

function firstZodError(error: ZodError): string {
  return error.issues[0]?.message ?? "Invalid data";
}

async function runMutation<T>(
  mutate: () => Promise<T>,
  revalidatePaths: string[],
): Promise<MutationResult<T>> {
  try {
    const data = await mutate();
    for (const path of revalidatePaths) {
      revalidatePath(path);
    }
    return { ok: true, data };
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

function readRawGameMetadata(formData: FormData) {
  return {
    name: formData.get("name")?.toString() ?? "",
    originalPrice: formData.get("originalPrice")?.toString() ?? "",
    discountPercent: formData.get("discountPercent")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    state: formData.get("state")?.toString() ?? "",
    launchDate: formData.get("launchDate")?.toString() ?? "",
    categoryNames: formData.getAll("categories").map(String),
    minimumSpecs: formData.get("minimumSpecs")?.toString() ?? "",
    recommendedSpecs: formData.get("recommendedSpecs")?.toString() ?? "",
  };
}

function readRawUserProfile(formData: FormData) {
  return {
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
    run: formData.get("run")?.toString(),
    firstName: formData.get("firstName")?.toString(),
    lastName: formData.get("lastName")?.toString(),
    birthDate: formData.get("birthDate")?.toString(),
    region: formData.get("region")?.toString(),
    comuna: formData.get("comuna")?.toString(),
    address: formData.get("address")?.toString(),
  };
}

export async function deleteUserAction(): Promise<{
  ok: boolean;
  error?: string;
}> {
  return runMutation(
    () =>
      fetchAPI<void>("/users", { method: "DELETE", auth: true, noStore: true }),
    ["/admin/users", "/admin"],
  );
}

export async function deleteUserByIdAction(
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  return runMutation(
    () =>
      fetchAPI<void>(`/users/${id}`, {
        method: "DELETE",
        auth: true,
        noStore: true,
      }),
    ["/admin/users", "/admin"],
  );
}

export async function createUserAction(
  input: UserCreateInput,
): Promise<{ ok: boolean; user?: User; error?: string }> {
  const result = await runMutation(
    () =>
      fetchAPI<User>("/users", {
        method: "POST",
        body: { email: input.email, password: input.password },
        auth: true,
        noStore: true,
      }),
    ["/admin/users", "/admin"],
  );
  return result.ok ? { ok: true, user: result.data } : result;
}

export async function createUserFromFormAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = AdminUserCreateSchema.safeParse(readRawUserProfile(formData));
  if (!parsed.success) {
    return { ok: false, error: firstZodError(parsed.error) };
  }

  const created = await createUserAction({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (!created.ok || !created.user) {
    return { ok: false, error: created.error };
  }

  return updateUserProfileAction(created.user.id, {
    run: parsed.data.run,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    birthDate: parsed.data.birthDate || null,
    region: parsed.data.region || null,
    comuna: parsed.data.comuna || null,
    address: parsed.data.address,
  });
}

export async function deleteGameAction(
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  return runMutation(
    () =>
      fetchAPI<void>(`/games/${id}`, {
        method: "DELETE",
        auth: true,
        noStore: true,
      }),
    ["/admin/games", "/studio/games", "/admin", "/studio"],
  );
}

export async function createGameWithMediaAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = GameMetadataSchema.safeParse(readRawGameMetadata(formData));
  if (!parsed.success) {
    return { ok: false, error: firstZodError(parsed.error) };
  }

  const image = toFile(formData.get("image"));
  if (!image) {
    return { ok: false, error: "La imagen principal es obligatoria" };
  }

  const backend = new FormData();
  backend.append("metadata", toJsonPart(parsed.data));
  backend.append("image", image);
  appendMediaFiles(backend, formData);

  return runMutation(
    () =>
      fetchAPI<Game>("/games", {
        method: "POST",
        body: backend,
        auth: true,
        noStore: true,
      }),
    ["/admin/games", "/studio/games", "/admin", "/studio"],
  );
}

export async function updateGameWithMediaAction(
  id: number,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = GameMetadataSchema.safeParse(readRawGameMetadata(formData));
  if (!parsed.success) {
    return { ok: false, error: firstZodError(parsed.error) };
  }

  const backend = new FormData();
  backend.append("metadata", toJsonPart(parsed.data));
  const image = toFile(formData.get("image"));
  if (image) backend.append("image", image);
  appendMediaFiles(backend, formData);

  return runMutation(
    () =>
      fetchAPI<Game>(`/games/${id}`, {
        method: "PUT",
        body: backend,
        auth: true,
        noStore: true,
      }),
    [
      "/admin/games",
      `/admin/games/${id}`,
      "/studio/games",
      `/studio/games/${id}`,
      "/admin",
      "/studio",
    ],
  );
}

export async function updateUserAction(
  id: number,
  input: AdminUserUpdateInput,
): Promise<{ ok: boolean; user?: User; error?: string }> {
  const body: Record<string, unknown> = {
    email: input.email,
    role: input.role,
  };
  if (input.password && input.password.length > 0) {
    body.password = input.password;
  }

  const result = await runMutation(
    () =>
      fetchAPI<User>(`/users/${id}`, {
        method: "PUT",
        body,
        auth: true,
        noStore: true,
      }),
    ["/admin/users", `/admin/users/${id}`, "/admin"],
  );
  return result.ok ? { ok: true, user: result.data } : result;
}

export async function updateUserProfileAction(
  id: number,
  input: Partial<Profile>,
): Promise<{ ok: boolean; user?: AdminUser; error?: string }> {
  const result = await runMutation(
    () =>
      fetchAPI<AdminUser>(`/profile/${id}`, {
        method: "PATCH",
        body: input,
        auth: true,
        noStore: true,
      }),
    ["/admin/users", `/admin/users/${id}`],
  );
  return result.ok ? { ok: true, user: result.data } : result;
}
