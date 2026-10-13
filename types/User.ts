export const USER_ROLES = ["ADMIN", "VENDEDOR", "CLIENTE"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type User = {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type UserCreateInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  run?: string;
  birthDate?: string | null;
  comunaId?: number | null;
  address?: string;
};
