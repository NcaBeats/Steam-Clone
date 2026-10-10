import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
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

  test("válido sin cover llama al action de crear", async () => {
    mockedCreate.mockResolvedValue({ ok: true });
    const { container } = renderForm();
    const title = container.querySelector('input[name="title"]');
    const excerpt = container.querySelector('textarea[name="excerpt"]');
    const content = container.querySelector('textarea[name="content"]');
    if (!title || !excerpt || !content) throw new Error("Missing fields");
    fireEvent.change(title, { target: { value: "New release" } });
    fireEvent.change(excerpt, { target: { value: "Short summary" } });
    fireEvent.change(content, { target: { value: "Full article body" } });
    fireEvent.click(screen.getByRole("button", { name: "Create blog" }));
    expect(await screen.findByText("Create blog")).toBeInTheDocument();
    expect(mockedCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New release",
        excerpt: "Short summary",
        content: "Full article body",
      }),
    );
    expect(push).toHaveBeenCalledWith("/admin/blogs");
  });
});
