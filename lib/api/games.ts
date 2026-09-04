import { fetchAPI } from "./fetch";
import type { Game, Category, Library } from "@/types";

export const getGames = (): Promise<Game[]> => fetchAPI("/games");

export const getGameById = (id: number): Promise<Game> =>
  fetchAPI(`/games/${id}`, { revalidate: 60 });

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
