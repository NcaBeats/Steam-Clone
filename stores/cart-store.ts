import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItemSchema, isDuplicateInCart } from "@/schemas/cart/cart.schema";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  discountPercent: number;
};

export type AddToCartResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" | "validation"; error: string };

type CartState = {
  items: CartItem[];
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addToCart: (item: CartItem) => AddToCartResult;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist<CartState, [], [], Pick<CartState, "items">>(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      addToCart: (item) => {
        const validation = CartItemSchema.safeParse(item);
        if (!validation.success) {
          const firstIssue = validation.error.issues[0];
          return {
            ok: false,
            reason: "validation",
            error: firstIssue?.message ?? "Invalid cart item",
          };
        }
        if (isDuplicateInCart(item, get().items)) {
          return {
            ok: false,
            reason: "duplicate",
            error: `${item.name} is already in your cart.`,
          };
        }
        set({ items: [...get().items, item] });
        return { ok: true };
      },

      removeFromCart: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const selectCartTotal = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.price, 0);

export const selectIsInCart =
  (id: number) =>
  (state: CartState): boolean =>
    state.items.some((i) => i.id === id);
