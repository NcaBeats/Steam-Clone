import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { CartList } from "@/components/cart/CartList";
import { useCartStore } from "@/stores/cart-store";
import type { CartItem } from "@/stores/cart-store";

const mockPush = vi.fn();

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
  CartItem: ({
    item,
    onRemove,
  }: {
    item: CartItem;
    onRemove: (id: number) => void;
  }) => (
    <div data-testid="cart-item" data-id={item.id}>
      <span>{item.name}</span>
      <button onClick={() => onRemove(item.id)}>remove</button>
    </div>
  ),
}));

const GAME_A: CartItem = {
  id: 1,
  name: "Minecraft",
  price: 29.99,
  imageUrl: "/img.png",
  discountPercent: 0,
};

const GAME_B: CartItem = {
  id: 2,
  name: "Celeste",
  price: 19.99,
  imageUrl: "/img2.png",
  discountPercent: 0,
};

const SINGLE_GAME: CartItem = {
  id: 1,
  name: "Game",
  price: 49.99,
  imageUrl: null,
  discountPercent: 0,
};

const seedCart = (items: CartItem[] = []) => {
  useCartStore.setState({ items, _hasHydrated: true });
};

describe("CartList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    seedCart();
  });

  afterEach(() => {
    cleanup();
    useCartStore.setState({ items: [], _hasHydrated: false });
  });

  test("muestra estado de carga cuando no está hidratado", () => {
    useCartStore.setState({ _hasHydrated: false });

    render(<CartList isLoggedIn={true} />);

    expect(screen.queryByText("Your cart is empty")).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Checkout" }),
    ).toBeNull();
  });

  test("muestra carrito vacío cuando no hay items y está hidratado", () => {
    render(<CartList isLoggedIn={true} />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Continue shopping" }),
    ).toBeInTheDocument();
  });

  test("renderiza items del carrito y resumen de orden", () => {
    seedCart([GAME_A, GAME_B]);

    render(<CartList isLoggedIn={true} />);

    const cartItems = screen.getAllByTestId("cart-item");
    expect(cartItems).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Order Summary" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Subtotal (2 items)")).toBeInTheDocument();
    expect(screen.getAllByText("$49.98")[0]).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Checkout" }),
    ).toBeInTheDocument();
  });

  test("abre AuthOverlay cuando el usuario no está logueado y hace clic en Checkout", () => {
    seedCart([SINGLE_GAME]);

    render(<CartList isLoggedIn={false} />);

    const checkoutButtons = screen.getAllByRole("button", { name: "Checkout" });
    fireEvent.click(checkoutButtons[0]);

    const overlays = screen.getAllByTestId("auth-overlay");
    expect(
      overlays.some((o) => o.getAttribute("data-open") === "true"),
    ).toBeTruthy();
  });

  test("navega a /checkout cuando el usuario está logueado y hace clic en Checkout", () => {
    seedCart([SINGLE_GAME]);

    render(<CartList isLoggedIn={true} />);

    const checkoutButtons = screen.getAllByRole("button", { name: "Checkout" });
    fireEvent.click(checkoutButtons[0]);

    expect(mockPush).toHaveBeenCalledWith("/checkout");
  });

  test("elimina el item del store cuando se quita uno", () => {
    seedCart([{ ...SINGLE_GAME, id: 5 }]);

    render(<CartList isLoggedIn={true} />);

    const removeButtons = screen.getAllByText("remove");
    fireEvent.click(removeButtons[0]);

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
