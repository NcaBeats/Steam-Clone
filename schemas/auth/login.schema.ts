import * as z from "zod";

const domains = new Set(["duoc.cl", "profesor.duoc.cl", "gmail.com"]);

const email = z
  .string()
  .trim()
  .max(100, "El email no puede superar los 100 caracteres")
  .pipe(z.email("Formato de email inválido"))
  .refine(
    (val) => {
      const domain = val.split("@").pop()?.toLowerCase();
      return domains.has(domain || "");
    },
    {
      message: "Solo dominios @duoc.cl @profesor.duoc.cl @gmail.com",
    },
  );

const password = z
  .string()
  .min(4, "El mínimo de caracteres son 4")
  .max(10, "El máximo de caracteres son 10");

export const LoginSchema = z.object({
  email: email,
  password: password,
});
