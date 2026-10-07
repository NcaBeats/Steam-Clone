import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { PasswordInput } from "@/components/auth/PasswordInput";

afterEach(cleanup);

describe("PasswordInput", () => {
  test("oculta la contraseña por defecto", () => {
    render(
      <PasswordInput
        name="password"
        placeholder="Password"
        show={false}
        onToggle={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  test("muestra la contraseña cuando show es true", () => {
    render(
      <PasswordInput
        name="password"
        placeholder="Password"
        show
        onToggle={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "text",
    );
  });

  test("llama a onToggle al pulsar el botón", () => {
    const onToggle = vi.fn();
    render(
      <PasswordInput
        name="password"
        placeholder="Password"
        show={false}
        onToggle={onToggle}
      />,
    );
    screen.getByRole("button").click();
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
