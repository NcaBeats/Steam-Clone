import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PriceFilter } from "@/components/catalog/PriceFilter";

afterEach(cleanup);

const getRangeInputs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('input[type="range"]'));

describe("PriceFilter", () => {
  test("muestra el rango inicial y el slider", () => {
    const { container } = render(<PriceFilter />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("$25.00 – $50.00")).toBeInTheDocument();
    expect(getRangeInputs(container)).toHaveLength(2);
  });

  test("mover un thumb actualiza el precio mostrado", () => {
    const { container } = render(<PriceFilter />);
    const [minThumb] = getRangeInputs(container);
    fireEvent.change(minThumb, { target: { value: "30" } });
    expect(screen.getByText("$30.00 – $50.00")).toBeInTheDocument();
  });
});
