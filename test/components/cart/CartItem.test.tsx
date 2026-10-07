import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CartItem } from "@/components/cart/CartItem";

vi.mock("@/components/games/GameImage", () => ({
  GameImage: () => <img alt="Game image" />,
}));

const baseItem = {
  id: 1,
  name: "Minecraft",
  price: 29.99,
  imageUrl: "/minecraft.png",
  discountPercent: 0,
};

afterEach(cleanup);

describe("CartItem", () => {
  test("renderiza el nombre y precio formateado", () => {
    const handleRemove = vi.fn();
    render(<CartItem item={baseItem} onRemove={handleRemove} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("Minecraft")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.queryByText(/%/)).toBeNull();
  });

  test("muestra el badge de descuento cuando discountPercent > 0", () => {
    const handleRemove = vi.fn();
    render(
      <CartItem
        item={{ ...baseItem, discountPercent: 20, price: 23.99 }}
        onRemove={handleRemove}
      />,
    );
    expect(screen.getByText("-20%")).toBeInTheDocument();
    expect(screen.getByText("$23.99")).toBeInTheDocument();
  });

  test("llama a onRemove con el id del item al hacer clic en el botón de eliminar", () => {
    const handleRemove = vi.fn();
    render(<CartItem item={baseItem} onRemove={handleRemove} />);
    const removeButton = screen.getByRole("button");
    removeButton.click();
    expect(handleRemove).toHaveBeenCalledWith(1);
  });
});
