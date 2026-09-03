"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAPI } from "@/lib/api/fetch";
import type { Auth } from "@/types";
import { LoginSchema } from "@/schemas/auth/login.schema";
import { COOKIE_OPTIONS } from "./cookiesOptions";
import * as z from "zod";

const COOKIE_NAME = "token";

// 1. Tu interfaz unificada que cubre tanto los retornos de error como los de éxito
export interface FormState {
  success: boolean;
  fields?: {
    email?: string;
    password?: string;
  };
  errors: {
    email?: string[];
    password?: string[];
    global?: string[];
  } | null;
}

// 2. Tu función de simplificación (Helper local de validación)
function validateLogin(formData: FormData) {
  const rawFields = Object.fromEntries(formData);
  const result = LoginSchema.safeParse(rawFields);

  if (!result.success) {
    return {
      success: false as const,
      fields: rawFields as Record<string, string>,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  // Retornamos null en errors para cumplir estrictamente con la forma de FormState
  return {
    success: true as const,
    data: result.data,
    errors: null,
  };
}

// 3. Tu Server Action ultra limpio
export async function loginAction(
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  // Ejecutamos tu abstracción
  const validation = validateLogin(formData);

  // Si falla la validación de Zod, retornamos inmediatamente el estado de error
  if (!validation.success) return validation;

  // Si tiene éxito, extraemos el email y el password sanitizados
  const { email, password } = validation.data;

  try {
    const data = await fetchAPI<Auth>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: true,
    });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, data.token, COOKIE_OPTIONS);
  } catch {
    return {
      success: false,
      errors: { global: ["Credenciales inválidas o error en el servidor"] },
    };
  }

  redirect("/");
}
