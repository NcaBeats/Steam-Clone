"use server";

import { revalidatePath, updateTag } from "next/cache";
import { fetchAPI } from "@/lib/api/fetch";
import { GameMetadataSchema } from "@/schemas/admin/game.schema";
import { AdminUserCreateSchema } from "@/schemas/admin/user.schema";
import type {
  AdminUser,
  AdminUserUpdateInput,
  Game,
  GameMediaUrls,
  MediaKind,
  PresignedUploadResponse,
  Profile,
  User,
  UserCreateInput} from "@/types";
import type { PresignResult } from "@/lib/game-upload";
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

/**
 * Descarta los campos de media que no se subieron para que el backend conserve
 * lo que ya habia. Una galeria vacia tampoco se envia: el backend solo reemplaza
 * cuando recibe al menos una URL.
 */
function compactMedia(media: GameMediaUrls): Record<string, unknown> {
  const compact: Record<string, unknown> = {};
  if (media.videoUrl) compact.videoUrl = media.videoUrl;
  if (media.imageUrl) compact.imageUrl = media.imageUrl;
  if (media.bannerUrl) compact.bannerUrl = media.bannerUrl;
  if (media.galleryUrls && media.galleryUrls.length > 0) {
    compact.galleryUrls = media.galleryUrls;
  }
  return compact;
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
    address: formData.get("address")?.toString()};
}

export async function deleteUserAction(): Promise<{
  ok: boolean;
  error?: string;
}> {
  return runMutation(
    () =>
      fetchAPI<void>("/users", { method: "DELETE", auth: true}),
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
        auth: true}),
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
        body: {
          email: input.email,
          password: input.password,
          firstName: input.firstName,
          lastName: input.lastName,
          run: input.run,
          birthDate: input.birthDate ?? null,
          region: input.region ?? null,
          comuna: input.comuna ?? null,
          address: input.address},
        auth: true}),
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
    run: parsed.data.run,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    birthDate: parsed.data.birthDate || null,
    region: parsed.data.region || null,
    comuna: parsed.data.comuna || null,
    address: parsed.data.address});
  if (!created.ok || !created.user) {
    return { ok: false, error: created.error };
  }

  return { ok: true };
}

export async function deleteGameAction(
  id: number,
): Promise<{ ok: boolean; error?: string }> {
  const result = await runMutation(
    () =>
      fetchAPI<void>(`/games/${id}`, {
        method: "DELETE",
        auth: true}),
    [
      "/admin/games",
      `/admin/games/${id}`,
      "/studio/games",
      `/studio/games/${id}`,
      "/admin",
      "/studio",
      "/games",
      `/games/${id}`,
      "/catalog",
      "/",
      "/search",
      "/library",
    ],
  );
  if (result.ok) {
    updateTag(`/games/${id}`);
    updateTag("/games?size=100");
    updateTag("/games/discounted");
    updateTag("/games/banners?size=4");
  }
  return result;
}

export async function presignGameVideoAction(
  name: string,
  contentType: string,
): Promise<PresignResult<PresignedUploadResponse>> {
  try {
    return {
      ok: true,
      data: await fetchAPI<PresignedUploadResponse>(
        "/games/media/video/presign",
        {
          method: "POST",
          body: { name, contentType },
          auth: true},
      )};
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function presignGameImageAction(
  name: string,
  kind: MediaKind,
  contentType: string,
): Promise<PresignResult<PresignedUploadResponse>> {
  try {
    return {
      ok: true,
      data: await fetchAPI<PresignedUploadResponse>(
        "/games/media/image/presign",
        {
          method: "POST",
          body: { name, kind, contentType },
          auth: true},
      )};
  } catch (e) {
    return { ok: false, error: errorMessage(e) };
  }
}

export async function createGameWithUrlsAction(
  metadata: unknown,
  media: GameMediaUrls,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = GameMetadataSchema.safeParse(metadata);
  if (!parsed.success) {
    return { ok: false, error: firstZodError(parsed.error) };
  }

  return runMutation(
    () =>
      fetchAPI<Game>("/games", {
        method: "POST",
        body: { ...parsed.data, ...compactMedia(media) },
        auth: true}),
    ["/admin/games", "/studio/games", "/admin", "/studio"],
  );
}

export async function updateGameWithUrlsAction(
  id: number,
  metadata: unknown,
  media: GameMediaUrls,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = GameMetadataSchema.safeParse(metadata);
  if (!parsed.success) {
    return { ok: false, error: firstZodError(parsed.error) };
  }

  return runMutation(
    () =>
      fetchAPI<Game>(`/games/${id}`, {
        method: "PUT",
        body: { ...parsed.data, ...compactMedia(media) },
        auth: true}),
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
    role: input.role};
  if (input.password && input.password.length > 0) {
    body.password = input.password;
  }

  const result = await runMutation(
    () =>
      fetchAPI<User>(`/users/${id}`, {
        method: "PUT",
        body,
        auth: true}),
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
        auth: true}),
    ["/admin/users", `/admin/users/${id}`],
  );
  return result.ok ? { ok: true, user: result.data } : result;
}



