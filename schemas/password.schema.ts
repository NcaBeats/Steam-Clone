import * as z from "zod";

export const PASSWORD_MIN = 4;
export const PASSWORD_MAX = 10;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `Minimum of ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Maximum of ${PASSWORD_MAX} characters`);
