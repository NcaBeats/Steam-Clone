export type PurchaseStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export type PurchaseItem = {
  id: number;
  gameId: number;
  gameName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Purchase = {
  id: number;
  userId: number;
  totalAmount: number;
  status: PurchaseStatus;
  purchasedAt: string;
  items: PurchaseItem[];
};
