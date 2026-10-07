import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchGameCard } from "@/components/games/SearchGameCard";

vi.mock("@/components/games/GameImage", () => ({
  GameImage: () => <img alt="Game cover" />,
}));

const Props = {
  id: 7,
  name: "Hollow Knight",
  price: 8000,
  originalPrice: 10000,
  discountPercent: 20,
  imageUrl: "/hk.jpg",
};

afterEach(cleanup);

describe("SearchGameCard", () => {
  test("muestra los datos básicos del juego con su descuento y precios", () => {
    render(<SearchGameCard {...Props} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("Hollow Knight")).toBeInTheDocument();
    expect(screen.getByText("-20%")).toBeInTheDocument();
    expect(screen.getByText("$10,000.00")).toBeInTheDocument();
    expect(screen.getByText("$8,000.00")).toBeInTheDocument();
  });

  test("cuando no hay descuento, no muestra porcentaje ni precio tachado", () => {
    render(<SearchGameCard {...Props} price={10000} discountPercent={0} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("Hollow Knight")).toBeInTheDocument();
    expect(screen.queryByText(/%/)).toBeNull();
    expect(screen.queryByRole("deletion")).toBeNull();
    expect(screen.getByText("$10,000.00")).toBeInTheDocument();
  });

  test("redirige al detalle del juego con el ID correcto", () => {
    render(<SearchGameCard {...Props} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/games/7");
  });
});
