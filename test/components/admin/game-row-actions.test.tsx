import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GameRowActions } from "@/components/admin/dashboard/game-row-actions";
import { deleteGameAction } from "@/actions/admin";

vi.mock("@/actions/admin", () => ({
  deleteGameAction: vi.fn(),
}));

const mockedDelete = vi.mocked(deleteGameAction);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("GameRowActions", () => {
  test("abre el menú con Edit y Delete", async () => {
    render(<GameRowActions id={7} name="Hollow Knight" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Open actions for Hollow Knight" }),
    );
    expect(
      await screen.findByRole("menuitem", { name: "Edit" }),
    ).toHaveAttribute("href", "/admin/games/7");
    expect(
      screen.getByRole("menuitem", { name: "Delete" }),
    ).toBeInTheDocument();
  });

  test("Delete pide confirmación y borra al confirmar", async () => {
    mockedDelete.mockResolvedValue({ ok: true });
    render(<GameRowActions id={7} name="Hollow Knight" />);
    fireEvent.click(
      screen.getByRole("button", { name: "Open actions for Hollow Knight" }),
    );
    fireEvent.click(await screen.findByRole("menuitem", { name: "Delete" }));
    expect(await screen.findByText("Delete game")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(mockedDelete).toHaveBeenCalledWith(7);
  });
});
