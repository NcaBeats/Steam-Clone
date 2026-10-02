import { fetchAPI } from "./fetch";
import type { Blog } from "@/types";

export const getBlogs = (): Promise<Blog[]> =>
  fetchAPI("/blogs?size=20", { noStore: true, responseShape: "list" });

export const getBlogById = (id: number): Promise<Blog> =>
  fetchAPI(`/blogs/${id}`, { noStore: true });
