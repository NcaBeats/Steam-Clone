import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RowActions } from "@/components/admin/dashboard/row-actions";
import {
  deleteBlogByIdAction,
  deleteGameAction,
  deleteUserByIdAction,
} from "@/actions/admin";

vi.mock("@/actions/admin", () => ({
  deleteGameAction: vi.fn(),
  deleteUserByIdAction: vi.fn(),
  deleteBlogByIdAction: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

async function openMenu(label: string) {
  fireEvent.click(
    screen.getByRole("button", { name: `Open actions for ${label}` }),
  );
}

describe.each([
  {
    kind: "game",
    label: "Hollow Knight",
    editHref: "/admin/games/7",
    deleteTitle: "Delete game",
    action: vi.mocked(deleteGameAction),
  },
  {
    kind: "user",
    label: "user@gmail.com",
    editHref: "/admin/users/7",
    deleteTitle: "Delete user",
    action: vi.mocked(deleteUserByIdAction),
  },
  {
    kind: "blog",
    label: "Hello world",
    editHref: "/admin/blogs/7",
    deleteTitle: "Delete blog",
    action: vi.mocked(deleteBlogByIdAction),
  },
] as const)(
  "RowActions ($kind)",
  ({ kind, label, editHref, deleteTitle, action }) => {
    test("abre el menú con Edit y Delete", async () => {
      render(<RowActions kind={kind} id={7} label={label} />);
      await openMenu(label);
      expect(
        await screen.findByRole("menuitem", { name: "Edit" }),
      ).toHaveAttribute("href", editHref);
      expect(
        screen.getByRole("menuitem", { name: "Delete" }),
      ).toBeInTheDocument();
    });

    test("Delete pide confirmación y borra al confirmar", async () => {
      action.mockResolvedValue({ ok: true });
      render(<RowActions kind={kind} id={7} label={label} />);
      await openMenu(label);
      fireEvent.click(await screen.findByRole("menuitem", { name: "Delete" }));
      expect(await screen.findByText(deleteTitle)).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Delete" }));
      expect(action).toHaveBeenCalledWith(7);
    });
  },
);

describe("RowActions without delete", () => {
  test("oculta Delete cuando no está permitido", async () => {
    render(
      <RowActions
        kind="user"
        id={7}
        label="admin@gmail.com"
        allowDelete={false}
      />,
    );
    await openMenu("admin@gmail.com");
    expect(
      await screen.findByRole("menuitem", { name: "Edit" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Delete" })).toBeNull();
  });
});
