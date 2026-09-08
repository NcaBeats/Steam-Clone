import * as z from "zod";
import { validate, clean } from "rut.js";
import type { RegionData } from "@/types";

const domains = new Set(["duoc.cl", "profesor.duoc.cl", "gmail.com"]);

const run = z
  .string("Invalid format")
  .trim()
  .min(7, "The minimum amount of characters is 7")
  .max(9, "The maximum amount of characters is 9")
  .refine((val) => !val.includes(".") && !val.includes("-"), {
    message: "Points and dashes are not allowed",
  })
  .refine((val) => validate(val), {
    message: "RUN is not valid",
  })
  .transform((val) => clean(val));

const name = z.string().max(50, "The maximum amount of characters is 50");

const lastName = z.string().max(50, "The maximum amount of characters is 50");

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

const region = z.string().min(1, "Select a region");

const comuna = z.string().min(1, "Select a municipality");

const direccion = z
  .string()
  .min(1, "Address is required")
  .max(300, "Address cannot exceed 300 characters");

export const createSignUpSchema = (regiones: RegionData[]) => {
  return z
    .object({
      run: run,
      name: name,
      lastName: lastName,
      email: email,
      birthdate: birthdate,
      region: region.refine((val) => regiones.some((r) => r.nombre === val), {
        message: "Invalid region",
      }),
      comuna: comuna,
      direccion: direccion,
    })
    .refine(
      (data) => {
        const regionData = regiones.find((r) => r.nombre === data.region);
        if (!regionData) return false;
        return regionData.comunas.includes(data.comuna);
      },
      {
        message: "Invalid municipality for the selected region",
        path: ["comuna"],
      },
    );
};
