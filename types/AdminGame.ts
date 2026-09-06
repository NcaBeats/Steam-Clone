export type GameUpdateInput = {
  name: string;
  originalPrice: number;
  discountPercent: number;
  description: string;
  state: "AVAILABLE" | "COMING_SOON" | "DISCONTINUED";
  launchDate: string;
  categoryNames: string[];
};
