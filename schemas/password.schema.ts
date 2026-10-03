import * as z from "zod";

/**
 * Regla de password, declarada UNA sola vez para toda la app.
 *
 * Antes vivia en cinco lugares (sign-up, login, alta de admin, el chequeo a
 * mano de NewUserForm y el backend) y ya habia divergido: NewUserForm repetia
 * el rango a mano y el formulario de edicion no lo validaba. Todo consumidor
 * debe importar `passwordSchema` en vez de volver a escribir el rango.
 *
 * El valor tiene que coincidir con `@Size` en los DTOs del backend
 * (UserRequestCreate, AdminUserUpdateRequest, RegisterRequest, LoginRequest,
 * UserUpdatePassword): el backend es la autoridad y devuelve 400 si no.
 */
export const PASSWORD_MIN = 4;
export const PASSWORD_MAX = 10;

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Password cannot exceed ${PASSWORD_MAX} characters`);
