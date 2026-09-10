import { CartItemSchema, isDuplicateInCart } from "@/schemas/cart/cart.schema";

const CART_KEY = "cart";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  discountPercent: number;
};

export type AddToCartResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" | "validation"; error: string };

type CartListener = () => void;

const listeners = new Set<CartListener>();

const EMPTY_CART: CartItem[] = [];

let cachedCart: CartItem[] | null = null;

function isClient(): boolean {
  return typeof window !== "undefined";
}

function readCart(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return EMPTY_CART;
  const parsed: unknown = JSON.parse(raw);
  const result = CartItemSchema.array().safeParse(parsed);
  return result.success ? result.data : EMPTY_CART;
}

export function getCart(): CartItem[] {
  if (!isClient()) return [];
  if (cachedCart === null) cachedCart = readCart();
  return cachedCart;
}

function emitChange(): void {
  for (const listener of listeners) listener();
}

export function subscribeCart(listener: CartListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): CartItem[] {
  return getCart();
}

export function getCartServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function saveCart(items: CartItem[]): void {
  cachedCart = items;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  emitChange();
}

export function addToCart(item: CartItem): AddToCartResult {
  const validation = CartItemSchema.safeParse(item);
  if (!validation.success) {
    const firstIssue = validation.error.issues[0];
    return {
      ok: false,
      reason: "validation",
      error: firstIssue?.message ?? "Invalid cart item",
    };
  }

  const cart = getCart();
  if (isDuplicateInCart(item, cart)) {
    return {
      ok: false,
      reason: "duplicate",
      error: `${item.name} is already in your cart.`,
    };
  }

  saveCart([...cart, item]);
  return { ok: true };
}

export function isInCart(id: number): boolean {
  return getCart().some((i) => i.id === id);
}

export function removeFromCart(id: number): void {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
