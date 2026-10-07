import { describe, test, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AuthSwitchLink } from "@/components/auth/AuthSwitchLink";

afterEach(cleanup);

describe("AuthSwitchLink", () => {
  test("muestra el texto y el enlace", () => {
    render(
      <AuthSwitchLink
        text="Don't have an account?"
        href="/sign-up"
        linkText="Sign up"
      />,
    );
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
  });

  test("apunta al href correcto", () => {
    render(
      <AuthSwitchLink
        text="Have an account?"
        href="/log-in"
        linkText="Log in"
      />,
    );
    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute(
      "href",
      "/log-in",
    );
  });
});
