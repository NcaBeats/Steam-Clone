import { fetchAPI } from "./fetch";
import type { Blog } from "@/types";

export const getBlogs = async (): Promise<Blog[]> => {
  const page = await fetchAPI<{ content: Blog[] }>("/blogs?size=20");
  return page.content;
};

export const getBlogById = (id: number): Promise<Blog> =>
  fetchAPI<Blog>(`/blogs/${id}`);

