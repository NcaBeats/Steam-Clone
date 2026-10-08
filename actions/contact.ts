"use server";

import { fetchAPI } from "@/lib/api/fetch";
import {
  ContactSchema,
  type ContactInput,
} from "@/schemas/contact/contact.schema";

type ContactActionResult =
  | { success: true }
  | {
      success: false;
      error: string;
    };

export async function sendContactAction(
  data: ContactInput,
): Promise<ContactActionResult> {
  const result = ContactSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      error: "Invalid contact information.",
    };
  }

  try {
    await fetchAPI("/contacts", {
      method: "POST",
      body: result.data,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not send your message. Please try again.",
    };
  }
}
