import { UserRole } from "./User";

export type Profile = {
  userId: number;
  nickname: string;
  bio: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  run: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  region: string | null;
  comuna: string | null;
  address: string;
  createdAt: string;
};

export type AdminUser = {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
  profile: Profile;
};

export type AdminUserUpdateInput = {
  email: string;
  role: UserRole;
  password?: string;
};
