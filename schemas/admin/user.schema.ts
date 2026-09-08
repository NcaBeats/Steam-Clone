import * as z from "zod";

export const AdminUserCreateSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .max(100, "Email cannot exceed 100 characters")
    .pipe(z.email("Invalid email format")),
  password: z
    .string()
    .min(4, "The minimum amount of characters is 4")
    .max(10, "The maximum amount of characters is 10"),
  run: z
    .string()
    .trim()
    .min(7, "RUN is not valid (7-9 characters)")
    .max(9, "RUN is not valid (7-9 characters)"),
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
  birthDate: z.string().optional(),
  region: z.string().optional(),
  comuna: z.string().optional(),
  address: z.string().trim().max(300, "Address cannot exceed 300 characters"),
});

export type AdminUserCreateInput = z.infer<typeof AdminUserCreateSchema>;
