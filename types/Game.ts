import { Category } from "./Category";

export type Game = {
  id: number;
  name: string;
  originalPrice: number;
  price: number;
  discountPercent: number;
  description: string;
  state: string;
  launchDate: string;
  categories: Category[];
  imageUrl: string;
  bannerUrl: string | null;
  createdAt: string;
};
