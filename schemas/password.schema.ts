import * as z from "zod";

export const PASSWORD_MIN = 4;
export const PASSWORD_MAX = 10;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Password cannot exceed ${PASSWORD_MAX} characters`);
