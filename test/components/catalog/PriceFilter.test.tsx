import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PriceFilter } from "@/components/catalog/PriceFilter";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/catalog",
  useSearchParams: () => new URLSearchParams(""),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const getRangeInputs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('input[type="range"]'));

describe("PriceFilter", () => {
  test("muestra el rango inicial y el slider", () => {
    const { container } = render(<PriceFilter min={25} max={50} />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("$25.00 – $50.00")).toBeInTheDocument();
    expect(getRangeInputs(container)).toHaveLength(2);
  });

  test("arrastrar actualiza el display y navega con el rango", () => {
    const { container } = render(<PriceFilter min={25} max={50} />);
    const [minThumb] = getRangeInputs(container);
    fireEvent.change(minThumb, { target: { value: "30" } });
    expect(screen.getByText("$30.00 – $50.00")).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/catalog?minPrice=30&maxPrice=50");
  });

  test("al soltar commitea el rango a la URL sin la página", () => {
    const { container } = render(<PriceFilter min={25} max={50} />);
    const [minThumb] = getRangeInputs(container);
    fireEvent.keyDown(minThumb, { key: "ArrowRight", code: "ArrowRight" });
    fireEvent.keyUp(minThumb, { key: "ArrowRight", code: "ArrowRight" });
    expect(push).toHaveBeenCalledWith("/catalog?minPrice=30&maxPrice=50");
  });

  test("con rango angosto muestra link para limpiar", () => {
    render(<PriceFilter min={30} max={50} />);
    expect(
      screen.getByRole("link", { name: "Clear price filter" }),
    ).toHaveAttribute("href", "/catalog");
  });

  test("sin rango angosto no muestra link para limpiar", () => {
    render(<PriceFilter min={0} max={100} />);
    expect(
      screen.queryByRole("link", { name: "Clear price filter" }),
    ).toBeNull();
  });
});
