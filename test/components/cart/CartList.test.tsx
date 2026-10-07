import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartList } from "@/components/cart/CartList";

const mockPush = vi.fn();

// Mock de cart utilities
vi.mock("@/lib/cart", () => ({
  getCartSnapshot: vi.fn(),
  getCartServerSnapshot: vi.fn(),
  getCartTotal: vi.fn(),
  removeFromCart: vi.fn(),
  subscribeCart: vi.fn(() => () => {}),
}));

// Mock de use-hydrated
vi.mock("@/lib/use-hydrated", () => ({
  useHydrated: vi.fn(),
}));

// Mock de next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock de AuthOverlay
vi.mock("@/components/cart/AuthOverlay", () => ({
  AuthOverlay: ({ open }: { open: boolean }) => (
    <div data-testid="auth-overlay" data-open={open ? "true" : "false"} />
  ),
}));

// Mock de CartItem
vi.mock("@/components/cart/CartItem", () => ({
  CartItem: ({ item, onRemove }: any) => (
    <div data-testid="cart-item" data-id={item.id}>
      <span>{item.name}</span>
      <button onClick={() => onRemove(item.id)}>remove</button>
    </div>
  ),
}));

import {
  getCartSnapshot,
  getCartServerSnapshot,
  getCartTotal,
  removeFromCart,
  subscribeCart,
} from "@/lib/cart";
import { useHydrated } from "@/lib/use-hydrated";

describe("CartList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getCartServerSnapshot as any).mockReturnValue([]);
    (subscribeCart as any).mockReturnValue(() => {});
    (getCartTotal as any).mockReturnValue(0);
  });

  test("muestra estado de carga cuando no está hidratado", () => {
    (useHydrated as any).mockReturnValue(false);
    (getCartSnapshot as any).mockReturnValue([]);

    render(<CartList isLoggedIn={true} />);

    const pulseElements = document.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  test("muestra carrito vacío cuando no hay items y está hidratado", () => {
    (useHydrated as any).mockReturnValue(true);
    (getCartSnapshot as any).mockReturnValue([]);

    render(<CartList isLoggedIn={true} />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue shopping" })).toBeInTheDocument();
  });

  test("renderiza items del carrito y resumen de orden", () => {
    (useHydrated as any).mockReturnValue(true);
    const items = [
      { id: 1, name: "Minecraft", price: 29.99, imageUrl: "/img.png", discountPercent: 0 },
      { id: 2, name: "Celeste", price: 19.99, imageUrl: "/img2.png", discountPercent: 0 },
    ];
    (getCartSnapshot as any).mockReturnValue(items);
    (getCartTotal as any).mockReturnValue(49.98);

    render(<CartList isLoggedIn={true} />);

    const cartItems = screen.getAllByTestId("cart-item");
    expect(cartItems).toHaveLength(2);
    expect(screen.getByRole("heading", { name: "Order Summary" })).toBeInTheDocument();
    expect(screen.getByText("Subtotal (2 items)")).toBeInTheDocument();
    expect(screen.getAllByText("$49.98")[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Checkout" })).toBeInTheDocument();
  });

  test("abre AuthOverlay cuando el usuario no está logueado y hace clic en Checkout", () => {
    (useHydrated as any).mockReturnValue(true);
    const items = [{ id: 1, name: "Game", price: 1000, imageUrl: null, discountPercent: 0 }];
    (getCartSnapshot as any).mockReturnValue(items);
    (getCartTotal as any).mockReturnValue(1000);

    render(<CartList isLoggedIn={false} />);

    const checkoutButtons = screen.getAllByRole("button", { name: "Checkout" });
    fireEvent.click(checkoutButtons[0]);

    const overlays = screen.getAllByTestId("auth-overlay");
    expect(overlays.some((o) => o.getAttribute("data-open") === "true")).toBeTruthy();
  });

  test("navega a /checkout cuando el usuario está logueado y hace clic en Checkout", () => {
    vi.clearAllMocks();
    (useHydrated as any).mockReturnValue(true);
    const items = [{ id: 1, name: "Game", price: 1000, imageUrl: null, discountPercent: 0 }];
    (getCartSnapshot as any).mockReturnValue(items);
    (getCartTotal as any).mockReturnValue(1000);

    render(<CartList isLoggedIn={true} />);

    const checkoutButtons = screen.getAllByRole("button", { name: "Checkout" });
    fireEvent.click(checkoutButtons[0]);

    expect(mockPush).toHaveBeenCalledWith("/checkout");
  });

  test("llama a removeFromCart cuando se elimina un item", () => {
    (useHydrated as any).mockReturnValue(true);
    const items = [{ id: 5, name: "Game", price: 1000, imageUrl: null, discountPercent: 0 }];
    (getCartSnapshot as any).mockReturnValue(items);
    (getCartTotal as any).mockReturnValue(1000);

    render(<CartList isLoggedIn={true} />);

    const removeButtons = screen.getAllByText("remove");
    fireEvent.click(removeButtons[0]);

    expect(removeFromCart).toHaveBeenCalled();
  });
});
