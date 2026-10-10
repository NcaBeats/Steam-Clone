import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SearchGameRow } from "@/components/games/SearchGameRow";

vi.mock("@/components/games/GameImage", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  GameImage: () => <img alt="Hollow Knight" />,
}));

const Props = {
  name: "Hollow Knight",
  price: 8000,
  originalPrice: 10000,
  discountPercent: 20,
  imageUrl: "/hk.jpg",
};

afterEach(cleanup);

describe("SearchGameRow", () => {
  test("muestra nombre, descuento y precios", () => {
    render(<SearchGameRow {...Props} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("Hollow Knight")).toBeInTheDocument();
    expect(screen.getByText("-20%")).toBeInTheDocument();
    expect(screen.getByText("$10,000.00")).toBeInTheDocument();
    expect(screen.getByText("$8,000.00")).toBeInTheDocument();
  });

  test("sin descuento no muestra porcentaje ni precio tachado", () => {
    render(<SearchGameRow {...Props} price={10000} discountPercent={0} />);
    expect(screen.getByText("Hollow Knight")).toBeInTheDocument();
    expect(screen.queryByText(/%/)).toBeNull();
    expect(screen.queryByRole("deletion")).toBeNull();
    expect(screen.getByText("$10,000.00")).toBeInTheDocument();
  });

  test("no renderiza enlaces: la navegación la resuelve el Combobox", () => {
    render(<SearchGameRow {...Props} />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});
