import * as z from "zod";
import { passwordSchema } from "@/schemas/password.schema";

const domains = new Set(["duoc.cl", "profesor.duoc.cl", "gmail.com"]);

const email = z
  .string()
  .trim()
  .max(100, "Email cannot exceed 100 characters")
  .pipe(z.email("Invalid email format"))
  .refine(
    (val) => {
      const domain = val.split("@").pop()?.toLowerCase();
      return domains.has(domain || "");
    },
    {
      message: "Only @duoc.cl @profesor.duoc.cl @gmail.com domains",
    },
  );

const password = passwordSchema;

export const LoginSchema = z.object({
  email: email,
  password: password,
});
