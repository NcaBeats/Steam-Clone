/**
 * Payload que devuelve el backend al autenticar (`POST /auth/login` y
 * `POST /auth/register`). Es el token y su expiracion, no "la sesion" ni "la
 * autenticacion" completa: el usuario vive aparte, en `User`.
 */
export type AuthToken = {
  readonly token: string;
  readonly expiresIn: number;
};
