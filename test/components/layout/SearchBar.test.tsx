import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchBar } from "@/components/layout/SearchBar";
import { searchGamesClient } from "@/lib/api/search";
import type { Game } from "@/types";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/lib/api/search", () => ({
  searchGamesClient: vi.fn(),
}));

vi.mock("@/components/games/GameImage", () => ({
  GameImage: () => null,
}));

const mockedSearch = vi.mocked(searchGamesClient);

const game = {
  id: 7,
  name: "Hollow Knight",
  price: 8000,
  originalPrice: 10000,
  discountPercent: 20,
  imageUrl: "/hk.jpg",
} as Game;

const getInput = () => screen.getByRole("combobox", { name: "Search games" });

function typeQuery(value: string) {
  fireEvent.focus(getInput());
  fireEvent.change(getInput(), { target: { value } });
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SearchBar", () => {
  test("mientras escribe muestra los juegos que devuelve el servidor", async () => {
    mockedSearch.mockResolvedValue([game]);
    render(<SearchBar />);
    typeQuery("hollow");
    expect(await screen.findByText("Hollow Knight")).toBeInTheDocument();
    expect(mockedSearch).toHaveBeenCalledWith("hollow");
    expect(screen.getByText("$8,000.00")).toBeInTheDocument();
  });

  test("sin resultados muestra el estado vacío", async () => {
    mockedSearch.mockResolvedValue([]);
    render(<SearchBar />);
    typeQuery("zzz");
    expect(await screen.findByText('No results for "zzz"')).toBeInTheDocument();
  });

  test("Enter sin resaltado navega a la página de búsqueda", async () => {
    mockedSearch.mockResolvedValue([game]);
    render(<SearchBar />);
    typeQuery("hollow");
    await screen.findByText("Hollow Knight");
    fireEvent.keyDown(getInput(), { key: "Enter", code: "Enter" });
    expect(push).toHaveBeenCalledWith("/catalog?q=hollow");
  });

  test("flecha + Enter navega al detalle del juego resaltado", async () => {
    mockedSearch.mockResolvedValue([game]);
    render(<SearchBar />);
    typeQuery("hollow");
    await screen.findByText("Hollow Knight");
    fireEvent.keyDown(getInput(), { key: "ArrowDown", code: "ArrowDown" });
    fireEvent.keyDown(getInput(), { key: "Enter", code: "Enter" });
    expect(push).toHaveBeenCalledWith("/games/7");
    expect(getInput()).toHaveValue("");
  });

  test("borrar el texto cierra el panel", async () => {
    mockedSearch.mockResolvedValue([game]);
    render(<SearchBar />);
    typeQuery("hollow");
    await screen.findByText("Hollow Knight");
    fireEvent.change(getInput(), { target: { value: "" } });
    expect(screen.queryByText("Hollow Knight")).toBeNull();
  });

  test("click en una opción navega al juego sin dejar JSON en el input", async () => {
    mockedSearch.mockResolvedValue([game]);
    render(<SearchBar />);
    typeQuery("hollow");
    fireEvent.click(await screen.findByText("Hollow Knight"));
    expect(push).toHaveBeenCalledWith("/games/7");
    expect(getInput()).toHaveValue("");
  });
});
