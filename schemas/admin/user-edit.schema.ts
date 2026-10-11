import * as z from "zod";
import { passwordSchema } from "@/schemas/password.schema";
import { USER_ROLES } from "@/types";

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(100, "Email cannot exceed 100 characters")
  .pipe(z.email("Invalid email format"));

export const AdminUserEditSchema = z.object({
  email: emailField,
  role: z.enum(USER_ROLES),
  password: z
    .string()
    .transform((value) => value.trim())
    .pipe(z.union([z.literal(""), passwordSchema])),
  nickname: z
    .string()
    .trim()
    .min(1, "Nickname is required")
    .max(50, "Nickname cannot exceed 50 characters"),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name cannot exceed 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name cannot exceed 100 characters"),
  birthDate: z.date().nullable().optional(),
  comunaId: z.number().int().positive().nullable().optional(),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(300, "Address cannot exceed 300 characters"),
  bio: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

export type AdminUserEditInput = z.infer<typeof AdminUserEditSchema>;
