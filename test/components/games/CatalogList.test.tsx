import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CatalogList } from "@/components/games/CatalogList";
import type { Game } from "@/types";

vi.mock("@/components/feedback/FoldText", () => ({
  FoldText: () => null,
}));

const juegosMock: Game[] = [
  {
    id: 1,
    name: "Elden Ring",
    originalPrice: 59.99,
    price: 59.99,
    discountPercent: 0,
    description: "Un juego de rol de acción desarrollado por FromSoftware.",
    state: "AVAILABLE",
    launchDate: "2022-02-25",
    categories: [
      {
        id: 1,
        name: "RPG",
      },
      {
        id: 2,
        name: "Acción",
      },
    ],
    imageUrl: "/images/elden-ring.jpg",
    bannerUrl: "/images/elden-ring-banner.jpg",
    videoUrl: null,
    galleryUrls: [],
    sellerId: 1,
    minimumSpecs: null,
    recommendedSpecs: null,
    createdAt: "2022-02-25T00:00:00Z",
  },
  {
    id: 2,
    name: "Hades",
    originalPrice: 24.99,
    price: 24.99,
    discountPercent: 0,
    description:
      "Un juego roguelike de exploración de mazmorras desarrollado por Supergiant Games.",
    state: "AVAILABLE",
    launchDate: "2020-09-17",
    categories: [
      {
        id: 3,
        name: "Indie",
      },
      {
        id: 4,
        name: "Acción",
      },
    ],
    imageUrl: "/images/hades.jpg",
    bannerUrl: "/images/hades-banner.jpg",
    videoUrl: null,
    galleryUrls: [],
    sellerId: 2,
    minimumSpecs: null,
    recommendedSpecs: null,
    createdAt: "2020-09-17T00:00:00Z",
  },
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
