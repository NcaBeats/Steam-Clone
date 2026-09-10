"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAPI } from "@/lib/api/fetch";
import { ApiError } from "@/lib/api/errors";
import type { Auth, User } from "@/types";
import { LoginSchema } from "@/schemas/auth/login.schema";
import { COOKIE_OPTIONS } from "./cookiesOptions";
import * as z from "zod";

const COOKIE_NAME = "token";

export interface FormState {
  success: boolean;
  fields?: {
    email?: string;
  };
  errors: {
    email?: string[];
    password?: string[];
    global?: string[];
  } | null;
}

function validateLogin(formData: FormData) {
  const rawFields = Object.fromEntries(formData);
  const result = LoginSchema.safeParse(rawFields);

  if (!result.success) {
    const { password, ...safeFields } = rawFields as Record<string, string>;
    return {
      success: false as const,
      fields: safeFields,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
    errors: null,
  };
}

export async function loginAction(
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const validation = validateLogin(formData);

  if (!validation.success) return validation;

  const { email, password } = validation.data;

  let role: User["role"];

  try {
    const data = await fetchAPI<Auth>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, data.token, COOKIE_OPTIONS);

    const me = await fetchAPI<User>("/users/me", {
      headers: { Authorization: `Bearer ${data.token}` },
    });
    role = me.role;
  } catch (error) {
    const message =
      error instanceof ApiError && error.status === 401
        ? "Invalid email or password."
        : "Server error. Please try again.";
    return {
      success: false,
      fields: { email },
      errors: { global: [message] },
    };
  }

  redirect(
    role === "ADMIN" ? "/admin" : role === "VENDEDOR" ? "/studio/games" : "/",
  );
}
