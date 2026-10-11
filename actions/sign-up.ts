"use server";

import { redirect } from "next/navigation";
import { format } from "date-fns";
import * as z from "zod";

import { fetchAPI } from "@/lib/api/fetch";
import type { AuthToken } from "@/types";
import { signUpSchema } from "@/schemas/auth/sign-up.schema";

export async function signUpAction(values: z.infer<typeof signUpSchema>) {
  const result = signUpSchema.safeParse(values);

  if (!result.success) {
    return {
      success: false as const,
      errors: z.flattenError(result.error).fieldErrors,
    };
  }

  const {
    run,
    name,
    lastName,
    email,
    password,
    birthdate,
    comunaId,
    direccion,
  } = result.data;

  try {
    await fetchAPI<AuthToken>("/auth/register", {
      method: "POST",
      body: {
        run,
        firstName: name,
        lastName,
        email,
        password,

        birthDate: birthdate ? format(birthdate, "yyyy-MM-dd") : undefined,

        comunaId,
        address: direccion,
      },
    });
  } catch {
    return {
      success: false as const,
      errors: {
        global: ["Registration failed. Please try again."],
      },
    };
  }

  redirect("/log-in");
}
