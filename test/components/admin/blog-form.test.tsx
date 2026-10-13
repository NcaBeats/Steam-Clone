import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { BlogForm } from "@/components/admin/BlogForm";
import { AlertProvider } from "@/components/feedback";
import { createBlogAction } from "@/actions/admin";

const { push, refresh } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("@/actions/admin", () => ({
  createBlogAction: vi.fn(),
  updateBlogAction: vi.fn(),
  presignBlogCoverAction: vi.fn(),
}));

vi.mock("@/components/feedback", () => ({
  AlertProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useAlert: () => ({ showAlert: vi.fn(), alerts: [], dismissAlert: vi.fn() }),
}));

const mockedCreate = vi.mocked(createBlogAction);

const renderForm = () =>
  render(
    <AlertProvider>
      <BlogForm />
    </AlertProvider>,
  );

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("BlogForm", () => {
  test("título vacío muestra error de campo", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Create blog" }));
    expect(await screen.findByText("Title is required")).toBeInTheDocument();
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  test("elegir categoría por select la envía en el payload", async () => {
    mockedCreate.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderForm();
    const title = screen.getByPlaceholderText("Blog title");
    const excerpt = screen.getByPlaceholderText("Short summary...");
    const content = screen.getByPlaceholderText("Full article...");
    fireEvent.change(title, { target: { value: "New release" } });
    fireEvent.change(excerpt, { target: { value: "Short summary" } });
    fireEvent.change(content, { target: { value: "Full article body" } });
    await user.click(screen.getByLabelText("Category (optional)"));
    await user.click(await screen.findByRole("option", { name: "NEWS" }));
    fireEvent.click(screen.getByRole("button", { name: "Create blog" }));
    await waitFor(() => expect(mockedCreate).toHaveBeenCalled());
    expect(mockedCreate).toHaveBeenCalledWith(
      expect.objectContaining({ category: "NEWS" }),
    );
    expect(push).toHaveBeenCalledWith("/admin/blogs");
  });
});
