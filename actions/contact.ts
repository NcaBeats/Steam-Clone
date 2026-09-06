"use server";

import { fetchAPI } from "@/lib/api/fetch";
import {
  ContactSchema,
  type ContactInput,
} from "@/schemas/contact/contact.schema";

export type ContactFormState = {
  success: boolean;
  fields?: ContactInput;
  errors: {
    name?: string[];
    email?: string[];
    comment?: string[];
    global?: string[];
  } | null;
};

export async function sendContactAction(
  _prevState: ContactFormState | null,
  formData: FormData,
): Promise<ContactFormState> {
  const rawFields = Object.fromEntries(formData);
  const result = ContactSchema.safeParse(rawFields);

  if (!result.success) {
    return {
      success: false,
      fields: rawFields as ContactInput,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    await fetchAPI("/contacts", {
      method: "POST",
      body: result.data,
    });
    return { success: true, errors: null };
  } catch (e) {
    return {
      success: false,
      errors: {
        global: [
          e instanceof Error
            ? e.message
            : "Could not send your message. Please try again.",
        ],
      },
    };
  }
}
