"use server";

import { redirect } from "next/navigation";
import { fetchAPI } from "@/lib/api/fetch";
import type { Auth } from "@/types";
import { createSignUpSchema } from "@/schemas/auth/sign-up.schema";
import regiones from "@/data/regiones.json";
import * as z from "zod";

export interface SignUpFormState {
  success: boolean;
  fields?: Record<string, string>;
  errors: {
    run?: string[];
    name?: string[];
    lastName?: string[];
    email?: string[];
    birthdate?: string[];
    region?: string[];
    comuna?: string[];
    direccion?: string[];
    password?: string[];
    global?: string[];
  } | null;
}

function validateSignUp(formData: FormData) {
  const entries = Object.fromEntries(formData);
  const { birthdate, ...rest } = entries;

  const parsed: Record<string, unknown> = { ...rest };
  if (typeof birthdate === "string" && birthdate) {
    parsed.birthdate = new Date(birthdate);
  }

  const schema = createSignUpSchema(regiones);
  const result = schema.safeParse(parsed);

  if (!result.success) {
    // Sólo aquí, al devolver error, sacamos password/confirmPassword para safeFields
    const { password, confirmPassword, ...safeFields } = entries as Record<
      string,
      string
    >;
    return {
      success: false as const,
      fields: safeFields as Record<string, string>,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
    errors: null,
  };
}

export async function signUpAction(
  _prevState: SignUpFormState | null,
  formData: FormData,
): Promise<SignUpFormState> {
  const validation = validateSignUp(formData);

  if (!validation.success) return validation;

  const {
    run,
    name,
    lastName,
    email,
    password,
    birthdate,
    region,
    comuna,
    direccion,
  } = validation.data;

  try {
    await fetchAPI<Auth>("/auth/register", {
      method: "POST",
      body: {
        run,
        firstName: name,
        lastName,
        email,
        password,
        birthDate:
          birthdate instanceof Date
            ? birthdate.toISOString().split("T")[0]
            : undefined,
        region,
        comuna,
        address: direccion,
      },
    });
  } catch {
    const fields = Object.fromEntries(formData) as Record<string, string>;
    delete fields.password;
    delete fields.confirmPassword;
    return {
      success: false,
      fields,
      errors: { global: ["Registration failed. Please try again."] },
    };
  }

  redirect("/log-in");
}
