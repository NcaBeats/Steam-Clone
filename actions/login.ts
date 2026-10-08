"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchAPI } from "@/lib/api/fetch";
import { ApiError } from "@/lib/api/errors";
import type { AuthToken, User } from "@/types";
import { LoginSchema } from "@/schemas";
import { COOKIE_OPTIONS } from "./cookiesOptions";
import { z } from "zod";

const COOKIE_NAME = "token";

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const { email, password } = values;

  let role: User["role"];

  try {
    const data = await fetchAPI<AuthToken>("/auth/login", {
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
    if (error instanceof ApiError && error.status === 401) {
      return {
        success: false,
        errors: {
          global: ["Invalid email or password."],
        },
      };
    }

    return {
      success: false,
      errors: {
        global: ["Server error. Please try again."],
      },
    };
  }

  if (role === "ADMIN") {
    redirect("/admin");
  }

  if (role === "VENDEDOR") {
    redirect("/studio/games");
  }

  redirect("/");
}
