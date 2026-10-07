import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { GameListItem } from "@/components/games/GameListItem";

vi.mock("@/components/games/GameImage", () => ({
  GameImage: () => <img alt="Game image" />,
}));

const props = {
  id: 1,
  name: "Minecraft",
  price: 29.99,
  imageUrl: "/minecraft.png",
  categories: [
    {
      id: 1,
      name: "Mundo Abierto",
    },
    {
      id: 2,
      name: "Aventura",
    },
  ],
  launchDate: "2011-11-18",
};

afterEach(cleanup);

describe("GameListItem", () => {
  test("muestra los datos básicos del juego", () => {
    render(<GameListItem {...props} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("Minecraft")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("Mundo Abierto, Aventura")).toBeInTheDocument();
    expect(screen.getByText("Lanzamiento: 2011-11-18")).toBeInTheDocument();
  });

  test("redirige al detalle del juego con el ID correcto", () => {
    render(<GameListItem {...props} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/games/1");
  });
});
