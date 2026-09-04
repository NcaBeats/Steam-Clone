import * as z from "zod";
import type { CartItem } from "@/lib/cart";

export const CartItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name is required").max(100),
  price: z.number().min(0, "Price cannot be negative"),
  imageUrl: z.string().url("Invalid image URL"),
  discountPercent: z.number().int().min(0).max(100),
}) satisfies z.ZodType<CartItem>;

export type AddToCartInput = z.infer<typeof CartItemSchema>;

export const CartSchema = z.array(CartItemSchema);

export function isDuplicateInCart(
  item: CartItem,
  existing: CartItem[],
): boolean {
  return existing.some((i) => i.id === item.id);
}
