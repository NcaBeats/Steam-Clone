import { fetchAPI } from "./fetch";
import type { Game } from "@/types";

export const getGames = (): Promise<Game[]> => fetchAPI("/games");

export const getGameById = (id: number): Promise<Game> =>
  fetchAPI(`/games/${id}`, { revalidate: 60 });

export const getDiscountedGames = (): Promise<Game[]> =>
  fetchAPI("/games/discounted", { revalidate: 30 });

export const getBannerGames = (): Promise<Game[]> =>
  fetchAPI("/games/banners?size=4", { revalidate: 300 });
