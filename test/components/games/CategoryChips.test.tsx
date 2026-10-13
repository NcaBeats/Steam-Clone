import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CategoryChips } from "@/components/games/CategoryChips";

afterEach(cleanup);

describe("CategoryChips", () => {
  test("no renderiza nada sin categorías", () => {
    const { container } = render(<CategoryChips categories={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("muestra las categorías recibidas", () => {
    render(
      <CategoryChips
        categories={[
          { id: 1, name: "Action" },
          { id: 2, name: "RPG" },
        ]}
      />,
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("RPG")).toBeInTheDocument();
  });

  test("cada chip enlaza a su sección", () => {
    render(<CategoryChips categories={[{ id: 1, name: "Action" }]} />);
    expect(screen.getByRole("link", { name: "Action" })).toHaveAttribute(
      "href",
      "#category-Action",
    );
  });
});
