/**
 * Los tres roles que emite el backend (`Role` en Java). Una sola declaracion:
 * `UserRole` se deriva de la lista, asi que agregar un rol no puede dejar el
 * tipo y los <select> desincronizados.
 */
export const USER_ROLES = ["ADMIN", "VENDEDOR", "CLIENTE"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type User = {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
};

/** Body de `POST /api/v1/users` (alta de usuario). Solo ADMIN lo llama. */
export type UserCreateInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  run?: string;
  birthDate?: string | null;
  region?: string | null;
  comuna?: string | null;
  address?: string;
};
