export type UserRole = "ADMIN" | "VENDEDOR" | "CLIENTE";

export type Profile = {
  userId: number;
  nickname: string;
  avatarImage: string | null;
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

export type PaginatedResponse<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
