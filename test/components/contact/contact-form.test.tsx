import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactForm } from "@/components/contact/ContactForm";
import { sendContactAction } from "@/actions/contact";

vi.mock("@/actions/contact", () => ({
  sendContactAction: vi.fn(),
}));

const mockedSend = vi.mocked(sendContactAction);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ContactForm", () => {
  test("el estado se actualiza al escribir", () => {
    render(<ContactForm />);
    const name = screen.getByPlaceholderText("Jhon");
    fireEvent.change(name, { target: { value: "Juan" } });
    expect(name).toHaveValue("Juan");
    const email = screen.getByPlaceholderText("user@gmail.com");
    fireEvent.change(email, { target: { value: "juan@gmail.com" } });
    expect(email).toHaveValue("juan@gmail.com");
    const comment = screen.getByPlaceholderText("Your message");
    fireEvent.change(comment, { target: { value: "Hello!" } });
    expect(comment).toHaveValue("Hello!");
  });

  test("enviar vacío muestra errores y no llama a la action", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Comment is required")).toBeInTheDocument();
    expect(mockedSend).not.toHaveBeenCalled();
  });

  test("envío válido llama a la action y muestra éxito", async () => {
    mockedSend.mockResolvedValue({ success: true });
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("Jhon"), {
      target: { value: "Juan" },
    });
    fireEvent.change(screen.getByPlaceholderText("user@gmail.com"), {
      target: { value: "juan@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your message"), {
      target: { value: "Hello!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText("Message sent")).toBeInTheDocument();
    expect(mockedSend).toHaveBeenCalledWith({
      name: "Juan",
      email: "juan@gmail.com",
      comment: "Hello!",
    });
  });

  test("error del servidor muestra alerta y mantiene el form", async () => {
    mockedSend.mockResolvedValue({
      success: false,
      error: "Service unavailable",
    });
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("Jhon"), {
      target: { value: "Juan" },
    });
    fireEvent.change(screen.getByPlaceholderText("user@gmail.com"), {
      target: { value: "juan@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your message"), {
      target: { value: "Hello!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Service unavailable",
    );
    expect(screen.queryByText("Message sent")).not.toBeInTheDocument();
  });
});
