export type User = {
  id: number;
  email: string;
  role: "ADMIN" | "VENDEDOR" | "CLIENTE";
  createdAt: string;
};
