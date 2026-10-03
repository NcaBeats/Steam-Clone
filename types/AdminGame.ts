import { GameState } from "./Game";

export type GameUpdateInput = {
  name: string;
  originalPrice: number;
  discountPercent: number;
  description: string;
  state: GameState;
  launchDate: string;
  categoryNames: string[];
};
