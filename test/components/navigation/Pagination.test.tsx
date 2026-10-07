import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Pagination } from "@/components/navigation/Pagination";

afterEach(cleanup);

describe("Pagination", () => {
  test("no renderiza nada con una sola página", () => {
    const { container } = render(
      <Pagination page={0} totalPages={1} basePath="/catalog" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("marca la página actual y construye los href", () => {
    render(<Pagination page={1} totalPages={3} basePath="/catalog" />);
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/catalog?page=0",
    );
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute(
      "href",
      "/catalog?page=2",
    );
  });

  test("Previous apunta atrás y Next adelante", () => {
    render(<Pagination page={1} totalPages={3} basePath="/catalog" />);
    expect(screen.getByRole("link", { name: /previous/i })).toHaveAttribute(
      "href",
      "/catalog?page=0",
    );
    expect(screen.getByRole("link", { name: /next/i })).toHaveAttribute(
      "href",
      "/catalog?page=2",
    );
  });
});
