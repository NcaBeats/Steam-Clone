export type PurchaseStatus = "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";

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
  buyerEmail: string;
  totalAmount: number;
  status: PurchaseStatus;
  purchasedAt: string;
  items: PurchaseItem[];
};
