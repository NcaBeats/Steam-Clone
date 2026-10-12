import { fetchAPI } from "./fetch";
import type { Blog, Paginated } from "@/types";

export const getBlogs = async (): Promise<Blog[]> => {
  const page = await fetchAPI<{ content: Blog[] }>("/blogs?size=20");
  return page.content;
};

export const getBlogById = (id: number): Promise<Blog> =>
  fetchAPI<Blog>(`/blogs/${id}`);

export const getAdminBlogs = (
  page = 0,
  size = 20,
  q?: string,
  sort?: string,
): Promise<Paginated<Blog>> =>
  fetchAPI<Paginated<Blog>>(
    "/blogs?page=" +
      page +
      "&size=" +
      size +
      (q ? "&q=" + encodeURIComponent(q) : "") +
      (sort ? "&sort=" + encodeURIComponent(sort) : ""),
  );
