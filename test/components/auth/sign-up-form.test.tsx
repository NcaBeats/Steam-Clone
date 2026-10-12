import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignUp from "@/app/(auth)/sign-up/page";
import { signUpAction } from "@/actions";

vi.mock("@/actions", () => ({
  signUpAction: vi.fn(),
}));

vi.mock("@/hooks/use-location", () => ({
  useRegions: () => ({ regions: [], loading: false, error: null }),
  useComunas: () => ({ comunas: [], loading: false }),
}));

vi.mock("@/app/(auth)/AuthLayout", () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockedSignUp = vi.mocked(signUpAction);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SignUp estado y validación", () => {
  test("el estado del nombre cambia al escribir", () => {
    render(<SignUp />);
    const nameInput = screen.getByPlaceholderText("John");
    fireEvent.change(nameInput, { target: { value: "Juan" } });
    expect(nameInput).toHaveValue("Juan");
    const lastNameInput = screen.getByPlaceholderText("Doe");
    fireEvent.change(lastNameInput, { target: { value: "Pérez" } });
    expect(lastNameInput).toHaveValue("Pérez");
  });

  test("enviar vacío muestra errores de requerido y no llama a la action", async () => {
    render(<SignUp />);
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByText("First name is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Last name is required"),
    ).toBeInTheDocument();
    expect(mockedSignUp).not.toHaveBeenCalled();
  });
});
