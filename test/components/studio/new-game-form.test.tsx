import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NewGameForm } from "@/components/studio/NewGameForm";
import {
  createGameWithUrlsAction,
  presignGameImageAction,
  presignGameVideoAction,
} from "@/actions/admin";
import { uploadGameMedia } from "@/lib/game-upload";

const { push, refresh, showAlert } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  showAlert: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("@/components/feedback", () => ({
  useAlert: () => ({ showAlert, alerts: [], dismissAlert: vi.fn() }),
}));

vi.mock("@/actions/admin", () => ({
  createGameWithUrlsAction: vi.fn(),
  presignGameImageAction: vi.fn(),
  presignGameVideoAction: vi.fn(),
}));

vi.mock("@/lib/game-upload", () => ({
  uploadGameMedia: vi.fn(),
}));

vi.mock("@/components/admin/DatePickerField", () => ({
  DatePickerField: () => <div data-testid="date-picker" />,
}));

vi.mock("@/components/inputs", () => ({
  FileDropzone: () => <div data-testid="file-dropzone" />,
  SpecsEditor: () => <div data-testid="specs-editor" />,
}));

const mockedCreate = vi.mocked(createGameWithUrlsAction);
const mockedUpload = vi.mocked(uploadGameMedia);

const categories = [
  { id: 1, name: "Action" },
  { id: 2, name: "RPG" },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("NewGameForm", () => {
  test("renderiza campos y el botón deshabilitado sin imagen", () => {
    render(<NewGameForm categories={categories} />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Price (USD)")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(
      screen.getByText("A main image is required to create the product."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create product" }),
    ).toBeDisabled();
    expect(screen.getByRole("link", { name: "Cancel" })).toHaveAttribute(
      "href",
      "/studio/games",
    );
  });

  test("el estado del nombre cambia al escribir", () => {
    render(<NewGameForm categories={categories} />);
    const name = screen.getByLabelText("Name");
    fireEvent.change(name, { target: { value: "Hollow Knight" } });
    expect(name).toHaveValue("Hollow Knight");
  });

  test("marcar categoría actualiza su checkbox", async () => {
    render(<NewGameForm categories={categories} />);
    const checkbox = screen.getByRole("checkbox", { name: "Action" });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test("enviar sin imagen no sube ni crea nada", () => {
    render(<NewGameForm categories={categories} />);
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Hollow Knight" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create product" }));
    expect(mockedUpload).not.toHaveBeenCalled();
    expect(mockedCreate).not.toHaveBeenCalled();
    expect(presignGameImageAction).not.toHaveBeenCalled();
    expect(presignGameVideoAction).not.toHaveBeenCalled();
  });
});
