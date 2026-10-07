import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { BlogCard } from "@/components/blog/BlogCard";
import type { Blog } from "@/types";

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

const baseBlog: Blog = {
  id: 3,
  title: "Top 10 RPGs of 2026",
  excerpt: "Our picks for this year.",
  content: "Full content.",
  coverImage: "/covers/rpg.jpg",
  category: "News",
  publishedAt: "2026-03-10T00:00:00Z",
  createdAt: "2026-03-10T00:00:00Z",
};

afterEach(cleanup);

describe("BlogCard", () => {
  test("muestra título, excerpt y categoría", () => {
    render(<BlogCard blog={baseBlog} />);
    expect(screen.getByText("Top 10 RPGs of 2026")).toBeInTheDocument();
    expect(screen.getByText("Our picks for this year.")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
  });

  test("sin coverImage muestra fallback y sin categoría no muestra badge", () => {
    render(
      <BlogCard blog={{ ...baseBlog, coverImage: null, category: null }} />,
    );
    expect(screen.getByText("No image")).toBeInTheDocument();
    expect(screen.queryByText("News")).toBeNull();
  });

  test("redirige al detalle del post con el ID correcto", () => {
    render(<BlogCard blog={baseBlog} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/blog/3");
  });
});
