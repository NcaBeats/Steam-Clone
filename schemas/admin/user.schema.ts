import * as z from "zod";

export const AdminUserCreateSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .max(100, "El email no puede superar los 100 caracteres")
    .pipe(z.email("Formato de email inválido")),
  password: z
    .string()
    .min(4, "El mínimo de caracteres son 4")
    .max(10, "El máximo de caracteres son 10"),
  run: z
    .string()
    .trim()
    .min(7, "El RUN no es válido (7-9 caracteres)")
    .max(9, "El RUN no es válido (7-9 caracteres)"),
  firstName: z
    .string()
    .trim()
    .min(1, "Los nombres son obligatorios")
    .max(50, "Los nombres no pueden superar 50 caracteres"),
  lastName: z
    .string()
    .trim()
    .min(1, "Los apellidos son obligatorios")
    .max(100, "Los apellidos no pueden superar 100 caracteres"),
  birthDate: z.string().optional(),
  region: z.string().optional(),
  comuna: z.string().optional(),
  address: z
    .string()
    .trim()
    .max(300, "La dirección no puede superar 300 caracteres"),
});

export type AdminUserCreateInput = z.infer<typeof AdminUserCreateSchema>;
