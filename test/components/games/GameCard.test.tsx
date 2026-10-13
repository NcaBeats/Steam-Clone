import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { GameCard } from "@/components/games/GameCard";

vi.mock("@/components/games/GameImage", () => ({
  GameImage: () => <img alt="Game image" />,
}));

const props = {
  id: 7,
  name: "Hollow Knight",
  price: 8000,
  originalPrice: 10000,
  discountPercent: 20,
  imageUrl: "/hk.jpg",
};

afterEach(cleanup);

describe("GameCard Test", () => {
  test("El juego muestra el precio final", () => {
    render(<GameCard {...props} />);
    expect(screen.getByText("$8,000.00")).toBeDefined();
  });

  test("El juego con descuento muestra el porcentaje y su valor original tachado", () => {
    render(<GameCard {...props} />);
    expect(screen.getByText(/-20%/)).toBeDefined();
    expect(screen.getByText("$10,000.00", { selector: "s" }).textContent).toBe(
      "$10,000.00",
    );
  });

  test("El juego sin descuento no debe mostrar porcentaje ni valor tachado", () => {
    render(<GameCard {...props} discountPercent={0} price={10000} />);
    expect(screen.queryByText(/%/)).toBeNull();
    expect(screen.getByText("$10,000.00")).toBeDefined();
  });

  test("Debe redirigir al juego con el endpoint construido", () => {
    render(<GameCard {...props} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/games/7");
  });

  test("Usa el id recibido por props para nombre y href", () => {
    render(<GameCard {...props} id={99} name="Stardew Valley" />);
    expect(screen.getByText("Stardew Valley")).toBeDefined();
    expect(screen.getByRole("link").getAttribute("href")).toBe("/games/99");
  });
});
