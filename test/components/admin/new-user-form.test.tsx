import { describe, test, expect, vi, afterEach } from "vitest";
import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { NewUserForm } from "@/app/(admin)/admin/users/new/NewUserForm";
import { createUserFromFormAction } from "@/actions/admin";

const { push, refresh } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("@/actions/admin", () => ({
  createUserFromFormAction: vi.fn(),
}));

vi.mock("@/lib/api/regions", () => ({
  getRegionsClient: vi
    .fn()
    .mockResolvedValue([{ id: 7, nombre: "Metropolitana de Santiago" }]),
  getComunasClient: vi.fn().mockResolvedValue([
    { id: 1, nombre: "Santiago", regionId: 7 },
    { id: 2, nombre: "Puente Alto", regionId: 7 },
  ]),
}));

const mockedCreate = vi.mocked(createUserFromFormAction);

const fillText = (placeholder: RegExp | string, value: string) => {
  fireEvent.change(screen.getByPlaceholderText(placeholder), {
    target: { value },
  });
};

const submit = async () => {
  fireEvent.click(screen.getByRole("button", { name: "Create user" }));
  return await screen.findByText("Create user");
};

const fillByName = (container: HTMLElement, name: string, value: string) => {
  const input = container.querySelector(`input[name="${name}"]`);
  if (!input) throw new Error(`Missing input ${name}`);
  fireEvent.change(input, { target: { value } });
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("NewUserForm", () => {
  test("muestra los campos principales", () => {
    render(<NewUserForm />);
    expect(screen.getByPlaceholderText("user@gmail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("12.345.678-9")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Date of birth" }),
    ).toBeInTheDocument();
  });

  test("email inválido muestra error de campo", async () => {
    render(<NewUserForm />);
    fillText("user@gmail.com", "not-an-email");
    await submit();
    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  test("passwords distintas muestran error en confirmación", async () => {
    render(<NewUserForm />);
    fillText("user@gmail.com", "user@gmail.com");
    fillText("4-10 characters", "abcd1234");
    fillText("Repeat password", "abcd9999");
    fillText("12.345.678-9", "11.111.111-1");
    await submit();
    expect(
      await screen.findByText("Passwords do not match"),
    ).toBeInTheDocument();
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  test("RUN inválido muestra error de campo", async () => {
    render(<NewUserForm />);
    fillText("user@gmail.com", "user@gmail.com");
    fillText("4-10 characters", "abcd1234");
    fillText("Repeat password", "abcd1234");
    fillText("12.345.678-9", "123");
    await submit();
    expect(
      await screen.findByText("RUN is not valid (7-9 characters)"),
    ).toBeInTheDocument();
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  test("región/comuna del catálogo guarda el comunaId", async () => {
    mockedCreate.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    const { container } = render(<NewUserForm />);
    fillText("user@gmail.com", "user@gmail.com");
    fillText("4-10 characters", "abcd1234");
    fillText("Repeat password", "abcd1234");
    fillText("12.345.678-9", "11.111.111-1");
    fillByName(container, "firstName", "Nico");
    fillByName(container, "lastName", "Carvajal");
    fillByName(container, "address", "Calle 123");

    const regionInput = screen.getByPlaceholderText("Select a region");
    await user.click(regionInput);
    await user.keyboard("Metro");
    fireEvent.click(await screen.findByText("Metropolitana de Santiago"));

    const comunaInput = screen.getByPlaceholderText("Select a municipality");
    await user.click(comunaInput);
    fireEvent.click(await screen.findByText("Puente Alto"));

    await submit();
    const formData = mockedCreate.mock.calls[0][0] as FormData;
    expect(formData.get("email")).toBe("user@gmail.com");
    expect(formData.get("run")).toBe("111111111");
    expect(formData.get("comunaId")).toBe("2");
    expect(push).toHaveBeenCalledWith("/admin/users");
  });

  test("el error de email aparece al enviar y desaparece al corregirlo", async () => {
    render(<NewUserForm />);
    fillText("user@gmail.com", "not-an-email");
    await submit();
    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
    expect(mockedCreate).not.toHaveBeenCalled();
    fillText("user@gmail.com", "user@gmail.com");
    await waitForElementToBeRemoved(() =>
      screen.queryByText("Invalid email format"),
    );
  });
});
