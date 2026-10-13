import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GameDetail } from "@/components/games/GameDetail";
import { useCartStore } from "@/stores/cart-store";
import type { Game } from "@/types";

const { showAlert } = vi.hoisted(() => ({ showAlert: vi.fn() }));

vi.mock("@/components/games/GameImage", () => ({
  GameImage: () => null,
}));

vi.mock("@/components/feedback", () => ({
  useAlert: () => ({ showAlert, alerts: [], dismissAlert: vi.fn() }),
}));

const game: Game = {
  id: 7,
  name: "Hollow Knight",
  originalPrice: 10000,
  price: 8000,
  discountPercent: 20,
  description: "A tiny knight explores a fallen kingdom.",
  state: "AVAILABLE",
  launchDate: "2017-02-24",
  categories: [],
  imageUrl: "https://cdn.example.com/hk.jpg",
  bannerUrl: null,
  videoUrl: null,
  galleryUrls: [],
  sellerId: null,
  minimumSpecs: null,
  recommendedSpecs: null,
  createdAt: "2026-01-01T00:00:00Z",
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
  useCartStore.setState({ items: [], _hasHydrated: false });
});

function renderDetail(inLibrary = false) {
  useCartStore.setState({ items: [], _hasHydrated: true });
  return render(<GameDetail game={game} initialInLibrary={inLibrary} />);
}

describe("GameDetail", () => {
  test("muestra nombre, precio y botón de compra", () => {
    renderDetail();
    expect(screen.getByText("Hollow Knight")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add to Cart" }),
    ).toBeInTheDocument();
  });

  test("agregar al carrito guarda el item y notifica", () => {
    renderDetail();
    fireEvent.click(screen.getByRole("button", { name: "Add to Cart" }));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toMatchObject({
      id: 7,
      name: "Hollow Knight",
    });
    expect(showAlert).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Added to cart" }),
    );
    const button = screen.getByRole("button", { name: "Already in cart" });
    expect(button).toBeDisabled();
  });

  test("juego en el carrito muestra botón deshabilitado", () => {
    useCartStore.setState({
      items: [
        {
          id: 7,
          name: "Hollow Knight",
          price: 8000,
          imageUrl: "https://cdn.example.com/hk.jpg",
          discountPercent: 20,
        },
      ],
      _hasHydrated: true,
    });
    render(<GameDetail game={game} initialInLibrary={false} />);
    expect(
      screen.getByRole("button", { name: "Already in cart" }),
    ).toBeDisabled();
  });

  test("juego en la librería muestra insignia en vez de botón", () => {
    renderDetail(true);
    expect(screen.getByText("In your library")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Add to Cart" }),
    ).not.toBeInTheDocument();
  });
});
