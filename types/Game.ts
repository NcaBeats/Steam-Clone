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
  // Nullable en el backend: la API devuelve null cuando el juego se creo sin
  // portada. Ver GameImage para el respaldo en la UI.
  imageUrl: string | null;
  bannerUrl: string | null;
  videoUrl: string | null;
  galleryUrls: string[];
  sellerId: number | null;
  minimumSpecs: string | null;
  recommendedSpecs: string | null;
  createdAt: string;
};
