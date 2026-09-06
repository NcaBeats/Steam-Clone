import { fetchAPI } from "./fetch";
import type { Blog } from "@/types";

export const getBlogs = (): Promise<Blog[]> =>
  fetchAPI("/blogs?size=20", { revalidate: 60 });

export const getBlogById = (id: number): Promise<Blog> =>
  fetchAPI(`/blogs/${id}`, { revalidate: 60 });
