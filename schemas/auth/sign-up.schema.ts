import * as z from "zod";
import { validate, clean } from "rut.js";

const domains = new Set(["duoc.cl", "profesor.duoc.cl", "gmail.com"]);

const run = z
  .string("Formato inválido")
  .trim()
  .min(7, "El mínimo de caracteres son 7")
  .max(9, "El máximo de caracteres son 9")
  .refine((val) => !val.includes(".") && !val.includes("-"), {
    message: "No se aceptan puntos ni guiones",
  })
  .refine((val) => validate(val), {
    message: "El rut no es válido",
  })
  .transform((val) => clean(val));

const name = z.string().max(50, "El máximo dde caracteres son 50");

const lastName = z.string().max(50, "El máximo dde caracteres son 50");

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

const birthdate = z
  .date({
    error: (issue) => {
      if (issue.input === undefined) return undefined;
      return "La fecha ingresada no existe o tiene un formato inválido";
    },
  })
  .max(new Date(), {
    error: "La fecha de nacimiento no puede ser en el futuro",
  }).optional;

export const SignUpSchema = z.object({
  run: run,
  name: name,
  lastName: lastName,
  email: email,
  birthdate: birthdate,
});
