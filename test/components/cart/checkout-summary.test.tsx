import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CheckoutSummary } from "@/components/cart/CheckoutSummary";
import { useCartStore } from "@/stores/cart-store";
import { getMyWalletAction } from "@/actions/wallet";
import { createPurchaseAction } from "@/actions/purchase";

const { push, showAlert } = vi.hoisted(() => ({
  push: vi.fn(),
  showAlert: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/components/feedback", () => ({
  useAlert: () => ({ showAlert, alerts: [], dismissAlert: vi.fn() }),
}));

vi.mock("@/actions/wallet", () => ({
  getMyWalletAction: vi.fn(),
}));

vi.mock("@/actions/purchase", () => ({
  createPurchaseAction: vi.fn(),
}));

vi.mock("@/components/cart/DepositFundsSheet", () => ({
  DepositFundsSheet: () => null,
}));

const mockedWallet = vi.mocked(getMyWalletAction);
const mockedPurchase = vi.mocked(createPurchaseAction);

const wallet = { userId: 1, balance: 100, updatedAt: "2026-01-01T00:00:00Z" };

function seedCart() {
  useCartStore.setState({
    items: [
      {
        id: 7,
        name: "Hollow Knight",
        price: 47.99,
        imageUrl: "/hk.jpg",
        discountPercent: 20,
      },
    ],
    _hasHydrated: true,
  });
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
  useCartStore.setState({ items: [], _hasHydrated: false });
});

describe("CheckoutSummary", () => {
  test("carrito vacío muestra mensaje para seguir comprando", async () => {
    mockedWallet.mockResolvedValue(wallet);
    useCartStore.setState({ items: [], _hasHydrated: true });
    render(<CheckoutSummary />);
    expect(await screen.findByText("Your cart is empty")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Continue shopping" }),
    ).toBeInTheDocument();
  });

  test("muestra resumen con total y confirma la compra", async () => {
    mockedWallet.mockResolvedValue(wallet);
    mockedPurchase.mockResolvedValue({ ok: true } as never);
    seedCart();
    render(<CheckoutSummary />);
    expect(await screen.findByText("Order Summary")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Confirm purchase" }));
    expect(await screen.findByText("Purchase successful")).toBeInTheDocument();
    expect(mockedPurchase).toHaveBeenCalledWith([{ gameId: 7, quantity: 1 }]);
    expect(useCartStore.getState().items).toHaveLength(0);
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Purchase completed" }),
    );
  });

  test("saldo insuficiente bloquea la confirmación", async () => {
    mockedWallet.mockResolvedValue({ ...wallet, balance: 10 });
    seedCart();
    render(<CheckoutSummary />);
    expect(await screen.findByText(/Insufficient balance/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirm purchase" }),
    ).toBeDisabled();
    expect(mockedPurchase).not.toHaveBeenCalled();
  });

  test("compra fallida muestra el error del servidor", async () => {
    mockedWallet.mockResolvedValue(wallet);
    mockedPurchase.mockResolvedValue({
      ok: false,
      message: "Card declined",
    } as never);
    seedCart();
    render(<CheckoutSummary />);
    fireEvent.click(
      await screen.findByRole("button", { name: "Confirm purchase" }),
    );
    expect(await screen.findByText("Card declined")).toBeInTheDocument();
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Purchase failed" }),
    );
  });
});
