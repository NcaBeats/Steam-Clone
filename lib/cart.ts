const CART_KEY = "cart";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  discountPercent: number;
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function getCart(): CartItem[] {
  if (!isClient()) return [];
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(items: CartItem[]): void {
  if (!isClient()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  if (cart.some((i) => i.id === item.id)) return;
  saveCart([...cart, item]);
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
