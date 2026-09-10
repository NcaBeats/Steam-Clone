import { Category } from "./Category";

export type GameState = "AVAILABLE" | "COMING_SOON" | "DISCONTINUED";

export type Game = {
  id: number;
  name: string;
  originalPrice: number;
  price: number;
  discountPercent: number;
  description: string;
  state: GameState;
  launchDate: string;
  categories: Category[];
  imageUrl: string;
  bannerUrl: string | null;
  videoUrl: string | null;
  galleryUrls: string[];
  sellerId: number | null;
  minimumSpecs: string | null;
  recommendedSpecs: string | null;
  createdAt: string;
};

export type GameCreateInput = {
  name: string;
  originalPrice: number;
  discountPercent: number;
  description: string;
  state: GameState;
  launchDate: string;
  categoryNames: string[];
};

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
