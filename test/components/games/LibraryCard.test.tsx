import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LibraryCard } from "@/components/games/LibraryCard";

vi.mock("@/components/games/GameImage", () => ({
  GameImage: () => <img alt="Game image" />,
}));

afterEach(cleanup);

describe("LibraryCard", () => {
  test("expone el nombre como aria-label accesible", () => {
    render(<LibraryCard id={5} name="Stardew Valley" imageUrl="/sdv.jpg" />);
    expect(
      screen.getByRole("link", { name: "Stardew Valley" }),
    ).toBeInTheDocument();
  });

  test("redirige al detalle del juego con el ID correcto", () => {
    render(<LibraryCard id={5} name="Stardew Valley" imageUrl="/sdv.jpg" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/games/5");
  });
});
