import * as z from "zod";

const domains = new Set(["duoc.cl", "profesor.duoc.cl", "gmail.com"]);

const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(100, "Email cannot exceed 100 characters")
  .pipe(z.email("Invalid email format"))
  .refine(
    (val) => {
      const domain = val.split("@").pop()?.toLowerCase();
      return domains.has(domain || "");
    },
    {
      message: "Only @duoc.cl, @profesor.duoc.cl, @gmail.com are allowed",
    },
  );

const name = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name cannot exceed 100 characters");

const comment = z
  .string()
  .trim()
  .min(1, "Comment is required")
  .max(500, "Comment cannot exceed 500 characters");

export const ContactSchema = z.object({
  name,
  email,
  comment,
});

export type ContactInput = z.infer<typeof ContactSchema>;
