import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CatalogList } from "@/components/games/CatalogList";
import type { Game } from "@/types";

vi.mock("@/components/feedback/FoldText", () => ({
  FoldText: () => null,
}));

const makeGame = (overrides: Partial<Game> = {}): Game => ({
  id: 1,
  name: "Elden Ring",
  originalPrice: 59.99,
  price: 59.99,
  discountPercent: 0,
  description: "",
  state: "AVAILABLE",
  launchDate: "2022-02-25",
  categories: [{ id: 1, name: "RPG" }],
  imageUrl: null,
  bannerUrl: null,
  videoUrl: null,
  galleryUrls: [],
  sellerId: null,
  minimumSpecs: null,
  recommendedSpecs: null,
  createdAt: "2022-02-25T00:00:00Z",
  ...overrides,
});

const juegosMock: Game[] = [
  makeGame(),
  makeGame({ id: 2, name: "Hades" }),
];

describe("CatalogList", () => {
  it("renderiza los juegos proporcionados mediante props", () => {
    render(<CatalogList games={juegosMock} />);

    expect(screen.getByText("Elden Ring")).toBeInTheDocument();
    expect(screen.getByText("Hades")).toBeInTheDocument();
  });

  it("renderiza una lista vacía cuando no hay juegos", () => {
    render(<CatalogList games={[]} />);

    expect(screen.queryByText("Elden Ring")).not.toBeInTheDocument();
    expect(screen.queryByText("Hades")).not.toBeInTheDocument();
  });
});
