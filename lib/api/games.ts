import { fetchAPI } from "./fetch";
import type {
  Game,
  Category,
  Library,
  Purchase,
  User,
  AdminUser,
  AdminUserUpdateInput,
  GameUpdateInput,
} from "@/types";

export const getGames = (): Promise<Game[]> => fetchAPI("/games?size=100");

export const getGamesPaginated = (
  page = 0,
  size = 10,
): Promise<Paginated<Game>> =>
  fetchAPI(`/games?page=${page}&size=${size}`, { paginated: true });

export const getGameById = (id: number): Promise<Game> =>
  fetchAPI(`/games/${id}`, { revalidate: 60 });

export type GameStats = {
  total: number;
  active: number;
  catalogValue: number;
};

export const getGameStats = (): Promise<GameStats> =>
  fetchAPI("/games/stats", { noStore: true });

export const getDiscountedGames = (): Promise<Game[]> =>
  fetchAPI("/games/discounted", { revalidate: 30 });

export const getBannerGames = (): Promise<Game[]> =>
  fetchAPI("/games/banners?size=4", { revalidate: 300 });

export const getCategories = (): Promise<Category[]> =>
  fetchAPI("/categories?size=50", { revalidate: 300 });

export const getMyLibrary = (): Promise<Library[]> =>
  fetchAPI("/library?size=50", { auth: true, revalidate: 0 });

export const searchGames = (name: string): Promise<Game[]> =>
  fetchAPI(`/games?name=${encodeURIComponent(name)}&size=10`, {
    revalidate: 0,
  });

export type Paginated<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export const getAdminUsers = (
  page = 0,
  size = 10,
  email?: string,
): Promise<Paginated<User>> =>
  fetchAPI(
    `/users?page=${page}&size=${size}${
      email ? `&email=${encodeURIComponent(email)}` : ""
    }`,
    { auth: true, noStore: true, paginated: true },
  );

export const getAdminUser = (id: number): Promise<AdminUser> =>
  fetchAPI(`/users/${id}`, { auth: true, noStore: true });

export const getAdminGames = (
  page = 0,
  size = 10,
  name?: string,
): Promise<Paginated<Game>> =>
  fetchAPI(
    `/games?page=${page}&size=${size}${
      name ? `&name=${encodeURIComponent(name)}` : ""
    }`,
    { noStore: true, paginated: true },
  );

export const getAdminGameById = (id: number): Promise<Game> =>
  fetchAPI(`/games/${id}`, { noStore: true });

export const getManageGames = (
  page = 0,
  size = 10,
  name?: string,
): Promise<Paginated<Game>> =>
  fetchAPI(
    `/manage/games?page=${page}&size=${size}${
      name ? `&name=${encodeURIComponent(name)}` : ""
    }`,
    { auth: true, noStore: true, paginated: true },
  );

export const getManageGameById = (id: number): Promise<Game> =>
  fetchAPI(`/manage/games/${id}`, { auth: true, noStore: true });

export const getManageOrders = (
  page = 0,
  size = 10,
): Promise<Paginated<Purchase>> =>
  fetchAPI(`/manage/orders?page=${page}&size=${size}`, {
    auth: true,
    noStore: true,
    paginated: true,
  });

export const getManageOrder = (id: number): Promise<Purchase> =>
  fetchAPI(`/manage/orders/${id}`, { auth: true, noStore: true });

export const updateAdminUser = (
  id: number,
  input: AdminUserUpdateInput,
): Promise<User> =>
  fetchAPI(`/users/${id}`, {
    method: "PUT",
    body: input,
    auth: true,
  });

export const updateAdminUserProfile = (
  id: number,
  input: {
    nickname?: string;
    bio?: string | null;
    visibility?: "PUBLIC" | "PRIVATE";
    firstName?: string;
    lastName?: string;
    birthDate?: string | null;
    region?: string | null;
    comuna?: string | null;
    address?: string;
  },
): Promise<AdminUser> =>
  fetchAPI(`/profile/${id}`, {
    method: "PATCH",
    body: input,
    auth: true,
  });

export const updateAdminGame = (
  id: number,
  input: GameUpdateInput,
): Promise<Game> =>
  fetchAPI(`/games/${id}`, {
    method: "PUT",
    body: {
      name: input.name,
      originalPrice: input.originalPrice,
      discountPercent: input.discountPercent,
      description: input.description,
      state: input.state,
      launchDate: input.launchDate,
      categoryNames: input.categoryNames,
    },
    auth: true,
    noStore: true,
  });
