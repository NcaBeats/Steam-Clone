import { fetchAPI } from "./client";
import type { Game } from "@/types";

export const getGames = (): Promise<Game[]> => fetchAPI("/games");

export const getDiscountedGames = (): Promise<Game[]> =>
  fetchAPI("/games/discounted", { revalidate: 30 });

export const getBannerGames = (): Promise<Game[]> =>
  fetchAPI("/games/banners?size=4", { revalidate: 300 });
