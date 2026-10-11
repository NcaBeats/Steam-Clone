import * as z from "zod";
import { validate, clean } from "rut.js";
import { passwordSchema } from "@/schemas/password.schema";

const domains = new Set(["duoc.cl", "profesor.duoc.cl", "gmail.com"]);

const run = z
  .string("Invalid format")
  .trim()
  .transform((val) => clean(val))
  .pipe(
    z
      .string()
      .min(7, "Minimum of 7 characters")
      .max(9, "Maximum of 9 characters")
      .refine((val) => validate(val), { message: "RUN is not valid" }),
  );

const name = z
  .string()
  .trim()
  .min(1, "First name is required")
  .max(50, "Maximun of 50 characters");

const lastName = z
  .string()
  .trim()
  .min(1, "Last name is required")
  .max(50, "Maximun of 50 characters");

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

const birthdate = z
  .date({
    error: (issue) => {
      if (issue.input === undefined) return undefined;
      return "The entered date does not exist or has an invalid format";
    },
  })
  .max(new Date(), {
    error: "The birth date cannot be in the future",
  })
  .optional();

const comunaId = z.number({ error: "Select a municipality" }).int().positive({
  error: "Select a municipality",
});

const direccion = z
  .string()
  .min(1, "Address is required")
  .max(300, "Address cannot exceed 300 characters");

const password = passwordSchema;

const confirmPassword = z.string();

export const signUpSchema = z
  .object({
    run: run,
    name: name,
    lastName: lastName,
    email: email,
    birthdate: birthdate,
    comunaId: comunaId,
    direccion: direccion,
    password: password,
    confirmPassword: confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["password"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
