import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GameEditForm } from "@/app/(admin)/admin/games/[id]/GameEditForm";
import { AlertProvider } from "@/components/feedback";
import type { Game, Category } from "@/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/actions/admin", () => ({
  presignGameImageAction: vi.fn(),
  presignGameVideoAction: vi.fn(),
  updateGameWithUrlsAction: vi.fn(),
}));

vi.mock("@/components/feedback", () => ({
  AlertProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAlert: () => ({ showAlert: vi.fn(), alerts: [], dismissAlert: vi.fn() }),
}));

const categories = [
  { id: 1, name: "Action" },
  { id: 2, name: "RPG" },
] as Category[];

const game = {
  id: 7,
  name: "Hollow Knight",
  originalPrice: 20,
  price: 16,
  discountPercent: 20,
  description: "A great game",
  state: "AVAILABLE",
  launchDate: "2017-02-24",
  categories: [{ id: 1, name: "Action" }],
  imageUrl: "/hk.jpg",
  bannerUrl: null,
  videoUrl: null,
  galleryUrls: [],
  sellerId: 1,
  minimumSpecs: "",
  recommendedSpecs: "",
  createdAt: "2024-01-01T00:00:00Z",
} as Game;

const renderForm = () =>
  render(
    <AlertProvider>
      <GameEditForm game={game} categories={categories} />
    </AlertProvider>,
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("GameEditForm categories", () => {
  test("usa checkboxes shadcn que alternan la selección", () => {
    renderForm();
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(2);
    const rpg = screen.getByRole("checkbox", { name: "RPG" });
    expect(rpg).toHaveAttribute("aria-checked", "false");
    fireEvent.click(rpg);
    expect(rpg).toHaveAttribute("aria-checked", "true");
    fireEvent.click(rpg);
    expect(rpg).toHaveAttribute("aria-checked", "false");
  });
});
